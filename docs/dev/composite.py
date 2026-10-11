"""vibecodingnav 场景综合评分：三种候选算法在真实榜单上的对比。
数据：src/content/boards/*.json 与 src/content/results.ts（nextjs-evals、reactbench 基线臂），2026-10-11 从 main 读取。
运行：python3 composite.py  → 打印各场景前 10，并写出 out/scores.json
"""
import json, math, statistics, os
D=os.path.join(os.path.dirname(__file__),'data')
NAMES={'claude-opus-5-5':'Claude Opus 5.5','gpt-6-astra':'GPT-6 Astra','claude-sonnet-5-5':'Claude Sonnet 5.5','gpt-6-1-sol':'GPT-6.1 Sol','claude-fable-5-1':'Claude Fable 5.1','claude-opus-5':'Claude Opus 5','gpt-6-sol':'GPT 6 Sol','gemini-4-argon':'Gemini 4 Argon','gemini-3-8-flash':'Gemini 3.8 Flash','qwen3-8-max':'Qwen3.8 Max','muse-spark-1-3':'Muse Spark 1.3','kimi-k3':'Kimi K3','grok-4-7':'Grok 4.7','mimo-v2-6-flash':'MiMo V2.6 Flash','qwen3-8-flash-next':'Qwen3.8 Flash Next','hy4-preview':'HY4 Preview','mimo-v2-6-pro':'MiMo V2.6 Pro','glm-5-3':'GLM-5.3','deepseek-v4-1-flash':'DeepSeek V4.1 Flash','claude-fable-5':'Claude Fable 5','gpt-5-6-sol':'GPT 5.6 Sol','gpt-5-6-luna':'GPT 5.6 Luna','gpt-5-6-terra':'GPT 5.6 Terra','gpt-6-luna':'GPT 6 Luna','claude-sonnet-5':'Claude Sonnet 5','claude-haiku-5-5':'Claude Haiku 5.5','gemini-3-1-pro':'Gemini 3.1 Pro Preview','glm-5-2':'GLM 5.2','kimi-k2-7-code':'Kimi K2.7 Code','cursor-composer-2-5':'Cursor Composer 2.5','minimax-m3':'MiniMax M3'}

def load_json_board(f):
    rows=json.load(open(os.path.join(D,f+'.json')))
    out=[]
    for r in rows:
        s=r['score']
        if '%' in r.get('scoreText',''): s=float(r['scoreText'].split('%')[0])
        out.append(dict(rank=r['rank'],key=r.get('modelSlug') or 'label:'+r['label'],score=s,prelim=bool(r.get('preliminary')),ci=r.get('ciPm')))
    return out,len(rows)
FW=json.load(open(os.path.join(D,'framework.json')))
def load_fw(b): return [dict(rank=r[0],key=r[1],score=r[2],prelim=False,ci=None) for r in FW[b]['rows']],FW[b]['N']

# kind: arena = Bradley-Terry 分（Elo 量纲），rate = 通过率 / 完成率
BOARDS={
 'webdev':  dict(name='LMArena WebDev',kind='arena',load=lambda:load_json_board('webdev')),
 'image':   dict(name='Image-to-WebDev',kind='arena',load=lambda:load_json_board('image-to-webdev')),
 'nextjs':  dict(name='Next.js Evals',kind='rate',load=lambda:load_fw('nextjs-evals')),
 'react':   dict(name='ReactBench',kind='rate',load=lambda:load_fw('reactbench')),
 'android': dict(name='Android Bench 2.0',kind='rate',load=lambda:load_json_board('android-long')),
 'terminal':dict(name='Terminal-Bench 4.0',kind='rate',load=lambda:load_json_board('terminal')),
 'sudo':    dict(name='sudo L7',kind='rate',load=lambda:load_json_board('sudo')),
}
# 推荐方案的权重：主榜 1；同一竞技场的相邻任务 0.6；框架厂商出题 / 第三方生态评测 0.4
SCEN={
 'web-frontend':dict(title='做 Web 前端',boards=[('webdev',1.0),('image',0.6),('nextjs',0.4),('react',0.4)]),
 'android-app':dict(title='做一个 Android App',boards=[('android',1.0)]),
 'cli-devops':dict(title='写 CLI、脚本与 DevOps',boards=[('terminal',1.0)]),
 'production-changes':dict(title='生产级改动与架构决策',boards=[('sudo',1.0)]),
}

def best_rows(rows):
    """每个模型只取该榜名次最好的一行（与站点融合表规则一致），名次相同取分数高者。"""
    m={}
    for r in rows:
        p=m.get(r['key'])
        if not p or r['rank']<p['rank'] or (r['rank']==p['rank'] and r['score']>p['score']): m[r['key']]=r
    return m

cache={}
def board(b):
    if b not in cache:
        rows,N=BOARDS[b]['load'](); cache[b]=(best_rows(rows),N)
    return cache[b]

# ---------- 三种单榜归一化 ----------
def norm_percentile(b):
    m,N=board(b); return {k:100*(N-r['rank'])/(N-1) for k,r in m.items()}
def norm_z(b):
    m,_=board(b); xs=[r['score'] for r in m.values()]; mu=statistics.mean(xs); sd=statistics.pstdev(xs) or 1
    return {k:100*0.5*(1+math.erf((r['score']-mu)/sd/math.sqrt(2))) for k,r in m.items()}
def norm_lead(b):
    """相对榜首水平：竞技场榜 = 2×对榜首的预期胜率；通过率榜 = 通过率 / 榜首通过率。榜首 = 100。"""
    m,_=board(b); top=max(r['score'] for r in m.values())
    if BOARDS[b]['kind']=='arena': return {k:200/(1+10**((top-r['score'])/400)) for k,r in m.items()}
    return {k:100*r['score']/top for k,r in m.items()}

def composite(scn,method):
    specs=SCEN[scn]['boards']; primary=specs[0][0]
    if method=='A':   # 名次百分位，等权，只平均出现的榜（≈ 现状换成百分位）
        norms={b:norm_percentile(b) for b,_ in specs}; W={b:1 for b,_ in specs}; lam=0; prior={}
    elif method=='B': # z 分数→百分位，加权，缺榜按 50 补，补位权重与真实相同
        norms={b:norm_z(b) for b,_ in specs}; W=dict(specs); lam=1.0; prior={b:50 for b,_ in specs}
    else:             # C 推荐：相对榜首 + 权重 + 向榜单中位水平收缩
        norms={b:norm_lead(b) for b,_ in specs}; W=dict(specs); lam=0.5
        prior={b:statistics.median([v for k,v in norms[b].items() if not k.startswith('label:')]) for b,_ in specs}
    keys=set().union(*[set(n) for n in norms.values()])
    out=[]
    for k in keys:
        if k not in norms[primary]: continue          # 必须出现在场景主榜
        num=den=obs=0; cells={}
        for b,_ in specs:
            w=W[b]
            if k in norms[b]:
                r=board(b)[0][k]; wc=w*(0.5 if (method=='C' and r['prelim']) else 1)
                num+=wc*norms[b][k]; den+=wc; obs+=w; cells[b]=dict(n=round(norms[b][k],1),rank=r['rank'],score=r['score'],prelim=r['prelim'])
            elif lam:
                num+=lam*w*prior[b]; den+=lam*w; cells[b]=None
            else: cells[b]=None
        cov=obs/sum(W.values())
        out.append(dict(key=k,name=NAMES.get(k,k.replace('label:','')),score=num/den,coverage=cov,cells=cells,primary_rank=board(primary)[0][k]['rank'],primary_score=board(primary)[0][k]['score']))
    out.sort(key=lambda x:(-round(x['score']),x['primary_rank'],-x['coverage']))
    # 名次：四舍五入后同分记并列
    prev=None
    for i,x in enumerate(out):
        s=round(x['score']); x['rank']=out[i-1]['rank'] if prev==s else i+1; x['tie']=prev==s; prev=s
    for i in range(len(out)-1):
        if out[i+1]['tie']: out[i]['tie']=True
    return out

if __name__=='__main__':
    res={}
    for scn in SCEN:
        res[scn]={}
        print('\n=====',SCEN[scn]['title'],'=====')
        for m in 'ABC':
            rows=composite(scn,m); res[scn][m]=rows[:10]
            print(f'-- 方法 {m}')
            for x in rows[:10]:
                cells=' '.join(f"{b}:{('#'+str(c['rank'])+'/'+str(c['n'])) if c else '—'}" for b,c in x['cells'].items())
                print(f"{x['rank']:>3}{'=' if x['tie'] else ' '} {x['name']:<22} {x['score']:6.1f}  cov {x['coverage']:.2f}  {cells}")
    os.makedirs(os.path.join(os.path.dirname(__file__),'out'),exist_ok=True)
    json.dump(res,open(os.path.join(os.path.dirname(__file__),'out','scores.json'),'w'),ensure_ascii=False,indent=1)
