/**
 * generators/index.js
 * Auto-generated deterministic test-case generators for all 100 missions.
 * Each generator(seed) returns { input: string, expected: string }
 */
module.exports = {};

// LCG pseudo-random helper
function lcg(seed) {
  let s = seed;
  return () => { s = (1664525 * s + 1013904223) & 0xffffffff; return Math.abs(s); };
}

// HM001
module.exports['HM001'] = (seed)=>({ input:'', expected:'Hello World' });

// HM002
module.exports['HM002'] = (seed)=>{ const names=['Alice','Bob','Charlie','Diana','Eve','Frank','Grace','Heidi']; const n=names[lcg(seed)()%names.length]; return {input:n,expected:n}; };

// HM003
module.exports['HM003'] = (seed)=>({ input:'', expected:'Line 1\nLine 2\nLine 3' });

// HM004
module.exports['HM004'] = (seed)=>{ const n=lcg(seed)()%1000; return {input:String(n),expected:String(n)}; };

// HM005
module.exports['HM005'] = (seed)=>{ const words=['Hello','World','Code','Learn','Python']; const w=words[lcg(seed)()%words.length]; return {input:w,expected:w}; };

// HM006
module.exports['HM006'] = (seed)=>{ const r=lcg(seed); const a=r()%100,b=r()%100; return {input:`${a} ${b}`,expected:String(a+b)}; };

// HM007
module.exports['HM007'] = (seed)=>{ const r=lcg(seed); const a=r()%100+10,b=r()%50; return {input:`${a} ${b}`,expected:String(a-b)}; };

// HM008
module.exports['HM008'] = (seed)=>{ const r=lcg(seed); const a=r()%20+1,b=r()%20+1; return {input:`${a} ${b}`,expected:String(a*b)}; };

// HM009
module.exports['HM009'] = (seed)=>{ const r=lcg(seed); const b=r()%10+1,a=b*(r()%10+1); return {input:`${a} ${b}`,expected:String(Math.floor(a/b))}; };

// HM010
module.exports['HM010'] = (seed)=>{ const r=lcg(seed); const b=r()%10+2,a=r()%100+b; return {input:`${a} ${b}`,expected:String(a%b)}; };

// HM011
module.exports['HM011'] = (seed)=>{ const r=lcg(seed); const a=r()%100,b=r()%100; return {input:`${a} ${b}`,expected:`${b} ${a}`}; };

// HM012
module.exports['HM012'] = (seed)=>{ const r=lcg(seed); const l=r()%20+1,w=r()%20+1; return {input:`${l} ${w}`,expected:String(l*w)}; };

// HM013
module.exports['HM013'] = (seed)=>{ const r=lcg(seed); const rad=(r()%20+1); const area=(Math.PI*rad*rad).toFixed(2); return {input:String(rad),expected:area}; };

// HM014
module.exports['HM014'] = (seed)=>{ const r=lcg(seed); const c=(r()%100)-20; return {input:String(c),expected:((c*9/5)+32).toFixed(2)}; };

// HM015
module.exports['HM015'] = (seed)=>{ const r=lcg(seed); const f=(r()%200)-50; return {input:String(f),expected:(((f-32)*5)/9).toFixed(2)}; };

// HM016
module.exports['HM016'] = (seed)=>{ const r=lcg(seed); const a=r()%100,b=r()%100,c=r()%100; return {input:`${a} ${b} ${c}`,expected:((a+b+c)/3).toFixed(2)}; };

// HM017
module.exports['HM017'] = (seed)=>{ const r=lcg(seed); const n=r()%15+1; return {input:String(n),expected:`${n*n} ${n*n*n}`}; };

// HM018
module.exports['HM018'] = (seed)=>{ const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'; const r=lcg(seed); const ch=chars[r()%chars.length]; return {input:ch,expected:String(ch.charCodeAt(0))}; };

// HM019
module.exports['HM019'] = (seed)=>{ const r=lcg(seed); const n=(r()%90)+5; return {input:String(n),expected:`${n+1} ${n-1}`}; };

// HM020
module.exports['HM020'] = (seed)=>{ const r=lcg(seed); const a=r()%50+1,b=r()%50+1; const ops=['+','-','*']; const op=ops[r()%ops.length]; const res=op==='+'?a+b:op==='-'?a-b:a*b; return {input:`${a} ${op} ${b}`,expected:String(res)}; };

// HM021
module.exports['HM021'] = (seed)=>{ const r=lcg(seed); const n=(r()%100)*((r()%2===0)?1:-1); return {input:String(n),expected:n%2===0?'Even':'Odd'}; };

// HM022
module.exports['HM022'] = (seed)=>{ const r=lcg(seed); const n=(r()%200)-100; return {input:String(n),expected:n>0?'Positive':n<0?'Negative':'Zero'}; };

// HM023
module.exports['HM023'] = (seed)=>{ const r=lcg(seed); const a=r()%100,b=r()%100; return {input:`${a} ${b}`,expected:String(Math.max(a,b))}; };

// HM024
module.exports['HM024'] = (seed)=>{ const r=lcg(seed); const a=r()%100,b=r()%100,c=r()%100; return {input:`${a} ${b} ${c}`,expected:String(Math.max(a,b,c))}; };

// HM025
module.exports['HM025'] = (seed)=>{ const years=[2000,2001,2004,1900,2024,2100,2023,2020,1996,2016]; const r=lcg(seed); const y=years[r()%years.length]; const isLeap=y%4===0&&(y%100!==0||y%400===0); return {input:String(y),expected:isLeap?'Leap Year':'Not a Leap Year'}; };

// HM026
module.exports['HM026'] = (seed)=>{ const r=lcg(seed); const a=r()%40+1; return {input:String(a),expected:a>=18?'Eligible':'Not Eligible'}; };

// HM027
module.exports['HM027'] = (seed)=>{ const r=lcg(seed); const m=r()%101; const g=m>=90?'A':m>=80?'B':m>=70?'C':m>=60?'D':'F'; return {input:String(m),expected:g}; };

// HM028
module.exports['HM028'] = (seed)=>{ const r=lcg(seed); const a=r()%50+1,b=r()%50+1; const ops=['+','-','*']; const op=ops[r()%ops.length]; const res=op==='+'?a+b:op==='-'?a-b:a*b; return {input:`${a} ${op} ${b}`,expected:String(res)}; };

// HM029
module.exports['HM029'] = (seed)=>{ const r=lcg(seed); const n=r()%10+3; return {input:String(n),expected:Array.from({length:n},(_,i)=>i+1).join(' ')}; };

// HM030
module.exports['HM030'] = (seed)=>{ const r=lcg(seed); const n=r()%10+3; return {input:String(n),expected:Array.from({length:n},(_,i)=>n-i).join(' ')}; };

// HM031
module.exports['HM031'] = (seed)=>{ const r=lcg(seed); const n=r()%8+3; const nums=Array.from({length:n},()=>r()%50-10); return {input:`${n}\n${nums.join(' ')}`,expected:String(nums.reduce((s,x)=>s+x,0))}; };

// HM032
module.exports['HM032'] = (seed)=>{ const factVals=[1,2,3,4,5,6,7,8,9,10]; const r=lcg(seed); const n=factVals[r()%factVals.length]; let f=1; for(let i=2;i<=n;i++)f*=i; return {input:String(n),expected:String(f)}; };

// HM033
module.exports['HM033'] = (seed)=>{ const r=lcg(seed); const n=r()%9+2,rows=r()%5+3; const lines=[]; for(let i=1;i<=rows;i++)lines.push(`${n} x ${i} = ${n*i}`); return {input:`${n} ${rows}`,expected:lines.join('\n')}; };

// HM034
module.exports['HM034'] = (seed)=>{ const r=lcg(seed); const n=r()%8+3; let a=0,b=1; const res=[]; for(let i=0;i<n;i++){res.push(a);[a,b]=[b,a+b];} return {input:String(n),expected:res.join(' ')}; };

// HM035
module.exports['HM035'] = (seed)=>{ const primes=[2,3,5,7,11,13,17,19,23,29,31,37]; const composites=[4,6,8,9,10,12,15,16,20,25]; const r=lcg(seed); const isPrime=r()%2===0; const pool=isPrime?primes:composites; const n=pool[r()%pool.length]; return {input:String(n),expected:isPrime?'Prime':'Not Prime'}; };

// HM036
module.exports['HM036'] = (seed)=>{ const armstrongs=[1,153,370,371,407]; const notArm=[2,10,100,200,500]; const r=lcg(seed); const isArm=r()%2===0; const pool=isArm?armstrongs:notArm; const n=pool[r()%pool.length]; return {input:String(n),expected:isArm?'Armstrong':'Not Armstrong'}; };

// HM037
module.exports['HM037'] = (seed)=>{ const pals=[121,131,1221,1001,9009]; const notPal=[123,456,789,100,200]; const r=lcg(seed); const isPal=r()%2===0; const pool=isPal?pals:notPal; const n=pool[r()%pool.length]; return {input:String(n),expected:isPal?'Palindrome':'Not Palindrome'}; };

// HM038
module.exports['HM038'] = (seed)=>{ const r=lcg(seed); const n=r()%9000+1000; const rev=String(n).split('').reverse().join('').replace(/^0+/,'')||'0'; return {input:String(n),expected:rev}; };

// HM039
module.exports['HM039'] = (seed)=>{ const r=lcg(seed); const n=r()%9000+10; return {input:String(n),expected:String(String(n).length)}; };

// HM040
module.exports['HM040'] = (seed)=>{ const r=lcg(seed); const n=r()%900+100; const s=String(n).split('').reduce((acc,c)=>acc+Number(c),0); return {input:String(n),expected:String(s)}; };

// HM041
module.exports['HM041'] = (seed)=>{ const r=lcg(seed); const n=r()%5+2; return {input:String(n),expected:Array.from({length:n},()=>'*'.repeat(n)).join('\n')}; };

// HM042
module.exports['HM042'] = (seed)=>{ const r=lcg(seed); const n=r()%5+2; return {input:String(n),expected:Array.from({length:n},(_,i)=>'*'.repeat(i+1)).join('\n')}; };

// HM043
module.exports['HM043'] = (seed)=>{ const r=lcg(seed); const n=r()%5+2; return {input:String(n),expected:Array.from({length:n},(_,i)=>'*'.repeat(n-i)).join('\n')}; };

// HM044
module.exports['HM044'] = (seed)=>{ const r=lcg(seed); const n=r()%5+2; return {input:String(n),expected:Array.from({length:n},(_,i)=>' '.repeat(n-i-1)+'*'.repeat(2*i+1)).join('\n')}; };

// HM045
module.exports['HM045'] = (seed)=>{ const r=lcg(seed); const n=r()%5+2; return {input:String(n),expected:Array.from({length:n},(_,i)=>' '.repeat(i)+'*'.repeat(2*(n-i)-1)).join('\n')}; };

// HM046
module.exports['HM046'] = (seed)=>{ const r=lcg(seed); const n=r()%4+2; const top=Array.from({length:n},(_,i)=>' '.repeat(n-i-1)+'*'.repeat(2*i+1)); const bot=Array.from({length:n-1},(_,i)=>' '.repeat(i+1)+'*'.repeat(2*(n-i-1)-1)); return {input:String(n),expected:[...top,...bot].join('\n')}; };

// HM047
module.exports['HM047'] = (seed)=>{ const r=lcg(seed); const n=r()%4+3; return {input:String(n),expected:Array.from({length:n},(_,i)=>(i===0||i===n-1)?'*'.repeat(n):'*'+' '.repeat(n-2)+'*').join('\n')}; };

// HM048
module.exports['HM048'] = (seed)=>{ const r=lcg(seed); const n=r()%5+2; return {input:String(n),expected:Array.from({length:n},(_,i)=>Array.from({length:i+1},(_,j)=>j+1).join(' ')).join('\n')}; };

// HM049
module.exports['HM049'] = (seed)=>{ const r=lcg(seed); const n=r()%5+2; let k=1; return {input:String(n),expected:Array.from({length:n},(_,i)=>{ const row=Array.from({length:i+1},()=>k++); return row.join(' '); }).join('\n')}; };

// HM050
module.exports['HM050'] = (seed)=>{ const r=lcg(seed); const n=r()%5+2; return {input:String(n),expected:Array.from({length:n},(_,i)=>{ let row=[1]; for(let j=1;j<=i;j++)row.push(row[j-1]*(i-j+1)/j|0); return row.join(' '); }).join('\n')}; };

// HM051
module.exports['HM051'] = (seed)=>{ const r=lcg(seed); const a=r()%100,b=r()%100; return {input:`${a} ${b}`,expected:String(a+b)}; };

// HM052
module.exports['HM052'] = (seed)=>{ const r=lcg(seed); const a=r()%100,b=r()%100; return {input:`${a} ${b}`,expected:String(Math.max(a,b))}; };

// HM053
module.exports['HM053'] = (seed)=>{ const vals=[1,2,3,4,5,6,7,8]; const r=lcg(seed); const n=vals[r()%vals.length]; let f=1; for(let i=2;i<=n;i++)f*=i; return {input:String(n),expected:String(f)}; };

// HM054
module.exports['HM054'] = (seed)=>{ const r=lcg(seed); const pool=[2,3,5,7,4,6,8,9,11,12,13]; const n=pool[r()%pool.length]; const isPrime=(n>=2&&[...Array(Math.floor(Math.sqrt(n))+1).keys()].slice(2).every(i=>n%i!==0)); return {input:String(n),expected:isPrime?'Prime':'Not Prime'}; };

// HM055
module.exports['HM055'] = (seed)=>{ const r=lcg(seed); const n=r()%7+3; let a=0,b=1; const res=[]; for(let i=0;i<n;i++){res.push(a);[a,b]=[b,a+b];} return {input:String(n),expected:res.join(' ')}; };

// HM056
module.exports['HM056'] = (seed)=>{ const vals=[1,2,3,4,5,6,7]; const r=lcg(seed); const n=vals[r()%vals.length]; let f=1; for(let i=2;i<=n;i++)f*=i; return {input:String(n),expected:String(f)}; };

// HM057
module.exports['HM057'] = (seed)=>{ const r=lcg(seed); const n=r()%6+3; function fib(k){return k<=1?k:fib(k-1)+fib(k-2);} return {input:String(n),expected:Array.from({length:n},(_,i)=>fib(i)).join(' ')}; };

// HM058
module.exports['HM058'] = (seed)=>{ const r=lcg(seed); const a=r()%50+2,b=r()%50+2; function gcd(x,y){return y===0?x:gcd(y,x%y);} return {input:`${a} ${b}`,expected:String(gcd(a,b))}; };

// HM059
module.exports['HM059'] = (seed)=>{ const r=lcg(seed); const a=r()%20+2,b=r()%20+2; function gcd(x,y){return y===0?x:gcd(y,x%y);} return {input:`${a} ${b}`,expected:String((a*b)/gcd(a,b))}; };

// HM060
module.exports['HM060'] = (seed)=>{ const r=lcg(seed); const b=r()%10+2,e=r()%5+1; return {input:`${b} ${e}`,expected:String(Math.pow(b,e))}; };

// HM061
module.exports['HM061'] = (seed)=>{ const r=lcg(seed); const n=r()%6+3; const nums=Array.from({length:n},()=>r()%50+1); return {input:`${n}\n${nums.join(' ')}`,expected:nums.join(' ')}; };

// HM062
module.exports['HM062'] = (seed)=>{ const r=lcg(seed); const n=r()%6+3; const nums=Array.from({length:n},()=>r()%50+1); return {input:`${n}\n${nums.join(' ')}`,expected:nums.join(' ')}; };

// HM063
module.exports['HM063'] = (seed)=>{ const r=lcg(seed); const n=r()%6+3; const nums=Array.from({length:n},()=>r()%50+1); return {input:`${n}\n${nums.join(' ')}`,expected:String(nums.reduce((s,x)=>s+x,0))}; };

// HM064
module.exports['HM064'] = (seed)=>{ const r=lcg(seed); const n=r()%6+3; const nums=Array.from({length:n},()=>r()%50+1); return {input:`${n}\n${nums.join(' ')}`,expected:(nums.reduce((s,x)=>s+x,0)/n).toFixed(2)}; };

// HM065
module.exports['HM065'] = (seed)=>{ const r=lcg(seed); const n=r()%6+3; const nums=Array.from({length:n},()=>r()%100+1); return {input:`${n}\n${nums.join(' ')}`,expected:String(Math.max(...nums))}; };

// HM066
module.exports['HM066'] = (seed)=>{ const r=lcg(seed); const n=r()%6+3; const nums=Array.from({length:n},()=>r()%100+1); return {input:`${n}\n${nums.join(' ')}`,expected:String(Math.min(...nums))}; };

// HM067
module.exports['HM067'] = (seed)=>{ const r=lcg(seed); const n=r()%5+4; const nums=[...new Set(Array.from({length:n+3},()=>r()%100+1))].slice(0,n); const sorted=[...nums].sort((a,b)=>b-a); return {input:`${n}\n${nums.join(' ')}`,expected:String(sorted[1])}; };

// HM068
module.exports['HM068'] = (seed)=>{ const r=lcg(seed); const n=r()%6+3; const nums=Array.from({length:n},()=>r()%50+1); return {input:`${n}\n${nums.join(' ')}`,expected:[...nums].reverse().join(' ')}; };

// HM069
module.exports['HM069'] = (seed)=>{ const r=lcg(seed); const n=r()%6+4; const nums=Array.from({length:n},()=>r()%50+1); const found=r()%2===0; const t=found?nums[r()%n]:r()%50+51; const idx=nums.indexOf(t); return {input:`${n}\n${nums.join(' ')}\n${t}`,expected:String(idx)}; };

// HM070
module.exports['HM070'] = (seed)=>{ const r=lcg(seed); const n=r()%6+4; const nums=Array.from({length:n},()=>r()%30+1); const e=nums.filter(x=>x%2===0).length; return {input:`${n}\n${nums.join(' ')}`,expected:`${e} ${n-e}`}; };

// HM071
module.exports['HM071'] = (seed)=>{ const words=['hello','world','programming','python','java','algorithm','data']; const r=lcg(seed); const w=words[r()%words.length]; return {input:w,expected:String(w.length)}; };

// HM072
module.exports['HM072'] = (seed)=>{ const words=['hello','world','python','java','code']; const r=lcg(seed); const w=words[r()%words.length]; return {input:w,expected:w.split('').reverse().join('')}; };

// HM073
module.exports['HM073'] = (seed)=>{ const pals=['racecar','madam','level','noon']; const notPals=['hello','world','python','java']; const r=lcg(seed); const isPal=r()%2===0; const pool=isPal?pals:notPals; const w=pool[r()%pool.length]; return {input:w,expected:isPal?'Palindrome':'Not Palindrome'}; };

// HM074
module.exports['HM074'] = (seed)=>{ const words=['programming','algorithm','data','structure','function']; const r=lcg(seed); const w=words[r()%words.length]; const v=[...w].filter(c=>'aeiou'.includes(c)).length; return {input:w,expected:String(v)}; };

// HM075
module.exports['HM075'] = (seed)=>{ const sentences=['hello world','how are you','good morning everyone','I love coding']; const r=lcg(seed); const s=sentences[r()%sentences.length]; return {input:s,expected:String(s.trim().split(/\s+/).length)}; };

// HM076
module.exports['HM076'] = (seed)=>{ const words=['Hello','wOrLd','Python','JAVA']; const r=lcg(seed); const w=words[r()%words.length]; return {input:w,expected:[...w].map(c=>c===c.toUpperCase()?c.toLowerCase():c.toUpperCase()).join('')}; };

// HM077
module.exports['HM077'] = (seed)=>{ const phrases=['h e l l o','w o r l d','p y t h o n','h e y m i n e']; const r=lcg(seed); const p=phrases[r()%phrases.length]; return {input:p,expected:p.replace(/\s+/g,'')}; };

// HM078
module.exports['HM078'] = (seed)=>{ const words=['aabbc','hello','programming','data']; const r=lcg(seed); const w=words[r()%words.length]; const freq={}; for(const c of w)freq[c]=(freq[c]||0)+1; const out=Object.entries(freq).sort((a,b)=>a[0].localeCompare(b[0])).map(([c,f])=>`${c}:${f}`).join('\n'); return {input:w,expected:out}; };

// HM079
module.exports['HM079'] = (seed)=>{ const pairs=[['hello','hello'],['world','word'],['java','java'],['python','Python']]; const r=lcg(seed); const [a,b]=pairs[r()%pairs.length]; return {input:`${a}\n${b}`,expected:a===b?'Equal':'Not Equal'}; };

// HM080
module.exports['HM080'] = (seed)=>{ const anagramPairs=[['listen','silent'],['hello','world'],['triangle','integral'],['cat','dog']]; const r=lcg(seed); const [a,b]=anagramPairs[r()%anagramPairs.length]; const sort=s=>[...s.toLowerCase()].sort().join(''); return {input:`${a}\n${b}`,expected:sort(a)===sort(b)?'Anagram':'Not Anagram'}; };

// HM081
module.exports['HM081'] = (seed)=>{ const r=lcg(seed); const n=r()%5+4; const nums=Array.from({length:n},()=>r()%50+1); const sorted=[...nums].sort((a,b)=>a-b); return {input:`${n}\n${nums.join(' ')}`,expected:sorted.join(' ')}; };

// HM082
module.exports['HM082'] = (seed)=>{ const r=lcg(seed); const n=r()%5+4; const nums=Array.from({length:n},()=>r()%50+1); const sorted=[...nums].sort((a,b)=>a-b); return {input:`${n}\n${nums.join(' ')}`,expected:sorted.join(' ')}; };

// HM083
module.exports['HM083'] = (seed)=>{ const r=lcg(seed); const n=r()%5+4; const nums=Array.from({length:n},()=>r()%50+1); const sorted=[...nums].sort((a,b)=>a-b); return {input:`${n}\n${nums.join(' ')}`,expected:sorted.join(' ')}; };

// HM084
module.exports['HM084'] = (seed)=>{ const r=lcg(seed); const n=r()%6+5; const nums=[...new Set(Array.from({length:n+5},()=>r()%100+1))].slice(0,n).sort((a,b)=>a-b); const found=r()%2===0; const t=found?nums[r()%n]:200+r()%50; const idx=nums.indexOf(t); return {input:`${n}\n${nums.join(' ')}\n${t}`,expected:String(idx)}; };

// HM085
module.exports['HM085'] = (seed)=>{ const r=lcg(seed); const n1=r()%4+3,n2=r()%4+3; const a=Array.from({length:n1},()=>r()%30+1); const b=Array.from({length:n2},()=>r()%30+1); const merged=[...a,...b].sort((x,y)=>x-y); return {input:`${n1}\n${a.join(' ')}\n${n2}\n${b.join(' ')}`,expected:merged.join(' ')}; };

// HM086
module.exports['HM086'] = (seed)=>{ const r=lcg(seed); const n=r()%5+5; const pool=[1,2,3,4,5,6,7,8]; const nums=Array.from({length:n},()=>pool[r()%pool.length]); const uniq=[...new Set(nums)]; return {input:`${n}\n${nums.join(' ')}`,expected:uniq.join(' ')}; };

// HM087
module.exports['HM087'] = (seed)=>{ const r=lcg(seed); const n=r()%5+4; const pool=[1,2,3,4,5]; const nums=Array.from({length:n},()=>pool[r()%pool.length]); const freq={}; for(const x of nums)freq[x]=(freq[x]||0)+1; const out=Object.entries(freq).map(([k,v])=>`${k}:${v}`).join('\n'); return {input:`${n}\n${nums.join(' ')}`,expected:out}; };

// HM088
module.exports['HM088'] = (seed)=>{ const r=lcg(seed); const n=r()%8+3; const missing=r()%n+1; const nums=Array.from({length:n},(_,i)=>i+1).filter(x=>x!==missing); const shuffled=nums.sort(()=>r()%2===0?1:-1); return {input:`${n}\n${shuffled.join(' ')}`,expected:String(missing)}; };

// HM089
module.exports['HM089'] = (seed)=>{ const r=lcg(seed); const n=r()%5+4; const nums=Array.from({length:n},()=>r()%20+1); const k=r()%n; const rotated=[...nums.slice(k),...nums.slice(0,k)]; return {input:`${n}\n${nums.join(' ')}\n${k}`,expected:rotated.join(' ')}; };

// HM090
module.exports['HM090'] = (seed)=>{ const r=lcg(seed); const n=r()%6+4; const nums=Array.from({length:n},()=>r()%20+1); let s=0; const prefix=nums.map(x=>(s+=x,s)); return {input:`${n}\n${nums.join(' ')}`,expected:prefix.join(' ')}; };

// HM091
module.exports['HM091'] = (seed)=>{ const r=lcg(seed); const n=r()%200+10; return {input:String(n),expected:(n>>>0).toString(2)}; };

// HM092
module.exports['HM092'] = (seed)=>{ const vals=['1010','1101','11111','10000','11001']; const r=lcg(seed); const b=vals[r()%vals.length]; return {input:b,expected:String(parseInt(b,2))}; };

// HM093
module.exports['HM093'] = (seed)=>{ const r=lcg(seed); const a=r()%50+2,b=r()%50+2; function gcd(x,y){return y===0?x:gcd(y,x%y);} return {input:`${a} ${b}`,expected:String(gcd(a,b))}; };

// HM094
module.exports['HM094'] = (seed)=>{ const r=lcg(seed); const a=r()%15+2,b=r()%15+2; function gcd(x,y){return y===0?x:gcd(y,x%y);} return {input:`${a} ${b}`,expected:String((a*b)/gcd(a,b))}; };

// HM095
module.exports['HM095'] = (seed)=>{ const perfects=[6,28,496]; const notPerf=[2,10,100,12,30]; const r=lcg(seed); const isPerfect=r()%2===0; const pool=isPerfect?perfects:notPerf; const n=pool[r()%pool.length]; return {input:String(n),expected:isPerfect?'Perfect':'Not Perfect'}; };

// HM096
module.exports['HM096'] = (seed)=>{ const strongs=[1,2,145,40585]; const notStr=[10,100,200,300]; const r=lcg(seed); const isStrong=r()%2===0; const pool=isStrong?strongs:notStr; const n=pool[r()%pool.length]; let fact=[1];for(let i=1;i<=9;i++)fact[i]=fact[i-1]*i; const s=String(n).split('').reduce((acc,c)=>acc+fact[Number(c)],0); return {input:String(n),expected:s===n?'Strong':'Not Strong'}; };

// HM097
module.exports['HM097'] = (seed)=>{ const autos=[1,5,6,25,76,376]; const notAuto=[2,10,23,30,100]; const r=lcg(seed); const isAuto=r()%2===0; const pool=isAuto?autos:notAuto; const n=pool[r()%pool.length]; const sq=n*n; return {input:String(n),expected:String(sq).endsWith(String(n))?'Automorphic':'Not Automorphic'}; };

// HM098
module.exports['HM098'] = (seed)=>{ const neons=[1,9]; const notNeon=[2,3,10,12,100]; const r=lcg(seed); const isNeon=r()%2===0; const pool=isNeon?neons:notNeon; const n=pool[r()%pool.length]; const sq=n*n; const s=String(sq).split('').reduce((acc,c)=>acc+Number(c),0); return {input:String(n),expected:s===n?'Neon':'Not Neon'}; };

// HM099
module.exports['HM099'] = (seed)=>{ const spies=[1,2,3,22,123]; const notSpy=[4,10,100,200,300]; const r=lcg(seed); const isSpy=r()%2===0; const pool=isSpy?spies:notSpy; const n=pool[r()%pool.length]; const d=String(n).split('').map(Number); const sumD=d.reduce((s,x)=>s+x,0),prodD=d.reduce((p,x)=>p*x,1); return {input:String(n),expected:sumD===prodD?'Spy':'Not Spy'}; };

// HM100
module.exports['HM100'] = (seed)=>{ const r=lcg(seed); const n=r()%3+3; const names=['Alice','Bob','Charlie','Diana','Eve','Frank']; const students=Array.from({length:n},(_,i)=>({name:names[i],marks:r()%101})); const sorted=[...students].sort((a,b)=>b.marks-a.marks); return {input:`${n}\n${students.map(s=>`${s.name} ${s.marks}`).join('\n')}`,expected:sorted.map(s=>`${s.name} ${s.marks}`).join('\n')}; };
