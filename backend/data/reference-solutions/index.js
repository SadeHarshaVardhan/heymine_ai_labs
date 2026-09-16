/**
 * reference-solutions/index.js
 * Server-side reference solutions for all 100 missions.
 * Each solve(input: string): string function returns the correct output.
 * NEVER expose this file to the frontend.
 */
module.exports = {};

// HM001
module.exports['HM001'] = (inp)=>'Hello World';

// HM002
module.exports['HM002'] = (inp)=>{ const name=inp.trim(); return name; };

// HM003
module.exports['HM003'] = (inp)=>'Line 1\nLine 2\nLine 3';

// HM004
module.exports['HM004'] = (inp)=>inp.trim();

// HM005
module.exports['HM005'] = (inp)=>inp.trim();

// HM006
module.exports['HM006'] = (inp)=>{ const [a,b]=inp.trim().split(/\s+/).map(Number); return String(a+b); };

// HM007
module.exports['HM007'] = (inp)=>{ const [a,b]=inp.trim().split(/\s+/).map(Number); return String(a-b); };

// HM008
module.exports['HM008'] = (inp)=>{ const [a,b]=inp.trim().split(/\s+/).map(Number); return String(a*b); };

// HM009
module.exports['HM009'] = (inp)=>{ const [a,b]=inp.trim().split(/\s+/).map(Number); return String(Math.floor(a/b)); };

// HM010
module.exports['HM010'] = (inp)=>{ const [a,b]=inp.trim().split(/\s+/).map(Number); return String(a%b); };

// HM011
module.exports['HM011'] = (inp)=>{ const [a,b]=inp.trim().split(/\s+/).map(Number); return `${b} ${a}`; };

// HM012
module.exports['HM012'] = (inp)=>{ const [l,w]=inp.trim().split(/\s+/).map(Number); return String(l*w); };

// HM013
module.exports['HM013'] = (inp)=>{ const r=Number(inp.trim()); return (Math.PI*r*r).toFixed(2); };

// HM014
module.exports['HM014'] = (inp)=>{ const c=Number(inp.trim()); return ((c*9/5)+32).toFixed(2); };

// HM015
module.exports['HM015'] = (inp)=>{ const f=Number(inp.trim()); return (((f-32)*5)/9).toFixed(2); };

// HM016
module.exports['HM016'] = (inp)=>{ const [a,b,c]=inp.trim().split(/\s+/).map(Number); return ((a+b+c)/3).toFixed(2); };

// HM017
module.exports['HM017'] = (inp)=>{ const n=Number(inp.trim()); return `${n*n} ${n*n*n}`; };

// HM018
module.exports['HM018'] = (inp)=>{ const ch=inp.trim()[0]; return String(ch.charCodeAt(0)); };

// HM019
module.exports['HM019'] = (inp)=>{ const n=Number(inp.trim()); return `${n+1} ${n-1}`; };

// HM020
module.exports['HM020'] = (inp)=>{ const parts=inp.trim().split(/\s+/); const a=Number(parts[0]),op=parts[1],b=Number(parts[2]); if(op==='+')return String(a+b); if(op==='-')return String(a-b); if(op==='*')return String(a*b); if(op==='/')return b===0?'Error':String(Math.floor(a/b)); return 'Error'; };

// HM021
module.exports['HM021'] = (inp)=>{ const n=Number(inp.trim()); return n%2===0?'Even':'Odd'; };

// HM022
module.exports['HM022'] = (inp)=>{ const n=Number(inp.trim()); return n>0?'Positive':n<0?'Negative':'Zero'; };

// HM023
module.exports['HM023'] = (inp)=>{ const [a,b]=inp.trim().split(/\s+/).map(Number); return String(Math.max(a,b)); };

// HM024
module.exports['HM024'] = (inp)=>{ const [a,b,c]=inp.trim().split(/\s+/).map(Number); return String(Math.max(a,b,c)); };

// HM025
module.exports['HM025'] = (inp)=>{ const y=Number(inp.trim()); return (y%4===0&&(y%100!==0||y%400===0))?'Leap Year':'Not a Leap Year'; };

// HM026
module.exports['HM026'] = (inp)=>{ const a=Number(inp.trim()); return a>=18?'Eligible':'Not Eligible'; };

// HM027
module.exports['HM027'] = (inp)=>{ const m=Number(inp.trim()); if(m>=90)return 'A'; if(m>=80)return 'B'; if(m>=70)return 'C'; if(m>=60)return 'D'; return 'F'; };

// HM028
module.exports['HM028'] = (inp)=>{ const parts=inp.trim().split(/\s+/); const a=Number(parts[0]),op=parts[1],b=Number(parts[2]); if(op==='+')return String(a+b); if(op==='-')return String(a-b); if(op==='*')return String(a*b); if(op==='/')return b===0?'Error':String(Math.floor(a/b)); return 'Invalid'; };

// HM029
module.exports['HM029'] = (inp)=>{ const n=Number(inp.trim()); return Array.from({length:n},(_,i)=>i+1).join(' '); };

// HM030
module.exports['HM030'] = (inp)=>{ const n=Number(inp.trim()); return Array.from({length:n},(_,i)=>n-i).join(' '); };

// HM031
module.exports['HM031'] = (inp)=>{ const lines=inp.trim().split('\n'); const n=Number(lines[0]); const nums=lines[1].trim().split(/\s+/).map(Number); return String(nums.reduce((s,x)=>s+x,0)); };

// HM032
module.exports['HM032'] = (inp)=>{ const n=Number(inp.trim()); let f=1; for(let i=2;i<=n;i++)f*=i; return String(f); };

// HM033
module.exports['HM033'] = (inp)=>{ const [n,r]=inp.trim().split(/\s+/).map(Number); const lines=[]; for(let i=1;i<=r;i++)lines.push(`${n} x ${i} = ${n*i}`); return lines.join('\n'); };

// HM034
module.exports['HM034'] = (inp)=>{ const n=Number(inp.trim()); let a=0,b=1; const res=[]; for(let i=0;i<n;i++){res.push(a);[a,b]=[b,a+b];} return res.join(' '); };

// HM035
module.exports['HM035'] = (inp)=>{ const n=Number(inp.trim()); if(n<2)return 'Not Prime'; for(let i=2;i<=Math.sqrt(n);i++)if(n%i===0)return 'Not Prime'; return 'Prime'; };

// HM036
module.exports['HM036'] = (inp)=>{ const n=Number(inp.trim()); const d=String(n).length; const s=String(n).split('').reduce((acc,c)=>acc+Math.pow(Number(c),d),0); return s===n?'Armstrong':'Not Armstrong'; };

// HM037
module.exports['HM037'] = (inp)=>{ const n=Number(inp.trim()); return String(n)===String(n).split('').reverse().join('')?'Palindrome':'Not Palindrome'; };

// HM038
module.exports['HM038'] = (inp)=>{ const n=Number(inp.trim()); return String(n).split('').reverse().join('').replace(/^0+/,'')||'0'; };

// HM039
module.exports['HM039'] = (inp)=>{ const n=Number(inp.trim()); return String(Math.abs(n)).length; };

// HM040
module.exports['HM040'] = (inp)=>{ const n=Number(inp.trim()); return String(String(Math.abs(n)).split('').reduce((s,c)=>s+Number(c),0)); };

// HM041
module.exports['HM041'] = (inp)=>{ const n=Number(inp.trim()); return Array.from({length:n},()=>'*'.repeat(n)).join('\n'); };

// HM042
module.exports['HM042'] = (inp)=>{ const n=Number(inp.trim()); return Array.from({length:n},(_,i)=>'*'.repeat(i+1)).join('\n'); };

// HM043
module.exports['HM043'] = (inp)=>{ const n=Number(inp.trim()); return Array.from({length:n},(_,i)=>'*'.repeat(n-i)).join('\n'); };

// HM044
module.exports['HM044'] = (inp)=>{ const n=Number(inp.trim()); return Array.from({length:n},(_,i)=>' '.repeat(n-i-1)+'*'.repeat(2*i+1)).join('\n'); };

// HM045
module.exports['HM045'] = (inp)=>{ const n=Number(inp.trim()); return Array.from({length:n},(_,i)=>' '.repeat(i)+'*'.repeat(2*(n-i)-1)).join('\n'); };

// HM046
module.exports['HM046'] = (inp)=>{ const n=Number(inp.trim()); const top=Array.from({length:n},(_,i)=>' '.repeat(n-i-1)+'*'.repeat(2*i+1)); const bot=Array.from({length:n-1},(_,i)=>' '.repeat(i+1)+'*'.repeat(2*(n-i-1)-1)); return [...top,...bot].join('\n'); };

// HM047
module.exports['HM047'] = (inp)=>{ const n=Number(inp.trim()); return Array.from({length:n},(_,i)=>(i===0||i===n-1)?'*'.repeat(n):'*'+' '.repeat(n-2)+'*').join('\n'); };

// HM048
module.exports['HM048'] = (inp)=>{ const n=Number(inp.trim()); return Array.from({length:n},(_,i)=>Array.from({length:i+1},(_,j)=>j+1).join(' ')).join('\n'); };

// HM049
module.exports['HM049'] = (inp)=>{ const n=Number(inp.trim()); let k=1; return Array.from({length:n},(_,i)=>{ const row=Array.from({length:i+1},()=>k++); return row.join(' '); }).join('\n'); };

// HM050
module.exports['HM050'] = (inp)=>{ const n=Number(inp.trim()); return Array.from({length:n},(_,i)=>{ let row=[1]; for(let j=1;j<=i;j++)row.push(row[j-1]*(i-j+1)/j|0); return row.join(' '); }).join('\n'); };

// HM051
module.exports['HM051'] = (inp)=>{ const [a,b]=inp.trim().split(/\s+/).map(Number); return String(a+b); };

// HM052
module.exports['HM052'] = (inp)=>{ const [a,b]=inp.trim().split(/\s+/).map(Number); return String(Math.max(a,b)); };

// HM053
module.exports['HM053'] = (inp)=>{ const n=Number(inp.trim()); let f=1; for(let i=2;i<=n;i++)f*=i; return String(f); };

// HM054
module.exports['HM054'] = (inp)=>{ const n=Number(inp.trim()); if(n<2)return 'Not Prime'; for(let i=2;i<=Math.sqrt(n);i++)if(n%i===0)return 'Not Prime'; return 'Prime'; };

// HM055
module.exports['HM055'] = (inp)=>{ const n=Number(inp.trim()); let a=0,b=1; const res=[]; for(let i=0;i<n;i++){res.push(a);[a,b]=[b,a+b];} return res.join(' '); };

// HM056
module.exports['HM056'] = (inp)=>{ function fact(n){return n<=1?1:n*fact(n-1);} return String(fact(Number(inp.trim()))); };

// HM057
module.exports['HM057'] = (inp)=>{ function fib(n){return n<=1?n:fib(n-1)+fib(n-2);} const n=Number(inp.trim()); return Array.from({length:n},(_,i)=>fib(i)).join(' '); };

// HM058
module.exports['HM058'] = (inp)=>{ function gcd(a,b){return b===0?a:gcd(b,a%b);} const [a,b]=inp.trim().split(/\s+/).map(Number); return String(gcd(a,b)); };

// HM059
module.exports['HM059'] = (inp)=>{ function gcd(a,b){return b===0?a:gcd(b,a%b);} const [a,b]=inp.trim().split(/\s+/).map(Number); return String((a*b)/gcd(a,b)); };

// HM060
module.exports['HM060'] = (inp)=>{ const [b,e]=inp.trim().split(/\s+/).map(Number); return String(Math.pow(b,e)); };

// HM061
module.exports['HM061'] = (inp)=>{ const lines=inp.trim().split('\n'); const n=Number(lines[0]); const nums=lines[1].trim().split(/\s+/).map(Number); return nums.join(' '); };

// HM062
module.exports['HM062'] = (inp)=>{ const lines=inp.trim().split('\n'); return lines[1].trim().split(/\s+/).join(' '); };

// HM063
module.exports['HM063'] = (inp)=>{ const lines=inp.trim().split('\n'); const nums=lines[1].trim().split(/\s+/).map(Number); return String(nums.reduce((s,x)=>s+x,0)); };

// HM064
module.exports['HM064'] = (inp)=>{ const lines=inp.trim().split('\n'); const nums=lines[1].trim().split(/\s+/).map(Number); return (nums.reduce((s,x)=>s+x,0)/nums.length).toFixed(2); };

// HM065
module.exports['HM065'] = (inp)=>{ const lines=inp.trim().split('\n'); const nums=lines[1].trim().split(/\s+/).map(Number); return String(Math.max(...nums)); };

// HM066
module.exports['HM066'] = (inp)=>{ const lines=inp.trim().split('\n'); const nums=lines[1].trim().split(/\s+/).map(Number); return String(Math.min(...nums)); };

// HM067
module.exports['HM067'] = (inp)=>{ const lines=inp.trim().split('\n'); const nums=lines[1].trim().split(/\s+/).map(Number).sort((a,b)=>b-a); return String(nums[1]); };

// HM068
module.exports['HM068'] = (inp)=>{ const lines=inp.trim().split('\n'); const nums=lines[1].trim().split(/\s+/); return nums.reverse().join(' '); };

// HM069
module.exports['HM069'] = (inp)=>{ const lines=inp.trim().split('\n'); const nums=lines[1].trim().split(/\s+/).map(Number); const t=Number(lines[2]); const idx=nums.indexOf(t); return idx===-1?'-1':String(idx); };

// HM070
module.exports['HM070'] = (inp)=>{ const lines=inp.trim().split('\n'); const nums=lines[1].trim().split(/\s+/).map(Number); const e=nums.filter(x=>x%2===0).length; return `${e} ${nums.length-e}`; };

// HM071
module.exports['HM071'] = (inp)=>{ return String(inp.trim().length); };

// HM072
module.exports['HM072'] = (inp)=>{ return inp.trim().split('').reverse().join(''); };

// HM073
module.exports['HM073'] = (inp)=>{ const s=inp.trim(); return s===s.split('').reverse().join('')?'Palindrome':'Not Palindrome'; };

// HM074
module.exports['HM074'] = (inp)=>{ const s=inp.trim().toLowerCase(); return String([...s].filter(c=>'aeiou'.includes(c)).length); };

// HM075
module.exports['HM075'] = (inp)=>{ return String(inp.trim().split(/\s+/).length); };

// HM076
module.exports['HM076'] = (inp)=>{ return [...inp.trim()].map(c=>c===c.toUpperCase()?c.toLowerCase():c.toUpperCase()).join(''); };

// HM077
module.exports['HM077'] = (inp)=>{ return inp.trim().replace(/\s+/g,''); };

// HM078
module.exports['HM078'] = (inp)=>{ const s=inp.trim(); const freq={}; for(const c of s)freq[c]=(freq[c]||0)+1; return Object.entries(freq).sort((a,b)=>a[0].localeCompare(b[0])).map(([c,f])=>`${c}:${f}`).join('\n'); };

// HM079
module.exports['HM079'] = (inp)=>{ const [a,b]=inp.trim().split('\n'); return a.trim()===b.trim()?'Equal':'Not Equal'; };

// HM080
module.exports['HM080'] = (inp)=>{ const [a,b]=inp.trim().split('\n'); const sort=s=>[...s.trim().toLowerCase()].sort().join(''); return sort(a)===sort(b)?'Anagram':'Not Anagram'; };

// HM081
module.exports['HM081'] = (inp)=>{ const lines=inp.trim().split('\n'); const a=lines[1].trim().split(/\s+/).map(Number); for(let i=0;i<a.length;i++)for(let j=0;j<a.length-i-1;j++)if(a[j]>a[j+1])[a[j],a[j+1]]=[a[j+1],a[j]]; return a.join(' '); };

// HM082
module.exports['HM082'] = (inp)=>{ const lines=inp.trim().split('\n'); const a=lines[1].trim().split(/\s+/).map(Number); for(let i=0;i<a.length;i++){let m=i;for(let j=i+1;j<a.length;j++)if(a[j]<a[m])m=j;[a[i],a[m]]=[a[m],a[i]];} return a.join(' '); };

// HM083
module.exports['HM083'] = (inp)=>{ const lines=inp.trim().split('\n'); const a=lines[1].trim().split(/\s+/).map(Number); for(let i=1;i<a.length;i++){const k=a[i];let j=i-1;while(j>=0&&a[j]>k){a[j+1]=a[j];j--;}a[j+1]=k;} return a.join(' '); };

// HM084
module.exports['HM084'] = (inp)=>{ const lines=inp.trim().split('\n'); const a=lines[1].trim().split(/\s+/).map(Number).sort((x,y)=>x-y); const t=Number(lines[2]); let lo=0,hi=a.length-1,res=-1; while(lo<=hi){const mid=(lo+hi)>>1;if(a[mid]===t){res=mid;break;}else if(a[mid]<t)lo=mid+1;else hi=mid-1;} return String(res); };

// HM085
module.exports['HM085'] = (inp)=>{ const lines=inp.trim().split('\n'); const a=lines[1].trim().split(/\s+/).map(Number); const b=lines[3].trim().split(/\s+/).map(Number); return [...a,...b].sort((x,y)=>x-y).join(' '); };

// HM086
module.exports['HM086'] = (inp)=>{ const lines=inp.trim().split('\n'); const a=[...new Set(lines[1].trim().split(/\s+/).map(Number))]; return a.join(' '); };

// HM087
module.exports['HM087'] = (inp)=>{ const lines=inp.trim().split('\n'); const a=lines[1].trim().split(/\s+/).map(Number); const freq={}; for(const x of a)freq[x]=(freq[x]||0)+1; return Object.entries(freq).map(([k,v])=>`${k}:${v}`).join('\n'); };

// HM088
module.exports['HM088'] = (inp)=>{ const lines=inp.trim().split('\n'); const n=Number(lines[0]); const a=lines[1].trim().split(/\s+/).map(Number); const expected=n*(n+1)/2; return String(expected-a.reduce((s,x)=>s+x,0)); };

// HM089
module.exports['HM089'] = (inp)=>{ const lines=inp.trim().split('\n'); const a=lines[1].trim().split(/\s+/).map(Number); const k=Number(lines[2])%a.length; return [...a.slice(k),...a.slice(0,k)].join(' '); };

// HM090
module.exports['HM090'] = (inp)=>{ const lines=inp.trim().split('\n'); const a=lines[1].trim().split(/\s+/).map(Number); let s=0; return a.map(x=>(s+=x,s)).join(' '); };

// HM091
module.exports['HM091'] = (inp)=>{ const n=Number(inp.trim()); return (n>>>0).toString(2); };

// HM092
module.exports['HM092'] = (inp)=>{ return String(parseInt(inp.trim(),2)); };

// HM093
module.exports['HM093'] = (inp)=>{ function gcd(a,b){return b===0?a:gcd(b,a%b);} const [a,b]=inp.trim().split(/\s+/).map(Number); return String(gcd(a,b)); };

// HM094
module.exports['HM094'] = (inp)=>{ function gcd(a,b){return b===0?a:gcd(b,a%b);} const [a,b]=inp.trim().split(/\s+/).map(Number); return String((a*b)/gcd(a,b)); };

// HM095
module.exports['HM095'] = (inp)=>{ const n=Number(inp.trim()); let s=0; for(let i=1;i<n;i++)if(n%i===0)s+=i; return s===n?'Perfect':'Not Perfect'; };

// HM096
module.exports['HM096'] = (inp)=>{ let fact=[1];for(let i=1;i<=9;i++)fact[i]=fact[i-1]*i; const n=Number(inp.trim()); const s=String(n).split('').reduce((acc,c)=>acc+fact[Number(c)],0); return s===n?'Strong':'Not Strong'; };

// HM097
module.exports['HM097'] = (inp)=>{ const n=Number(inp.trim()); const sq=n*n; return String(sq).endsWith(String(n))?'Automorphic':'Not Automorphic'; };

// HM098
module.exports['HM098'] = (inp)=>{ const n=Number(inp.trim()); const sq=n*n; const s=String(sq).split('').reduce((acc,c)=>acc+Number(c),0); return s===n?'Neon':'Not Neon'; };

// HM099
module.exports['HM099'] = (inp)=>{ const n=Number(inp.trim()); const d=String(n).split('').map(Number); const sumD=d.reduce((s,x)=>s+x,0); const prodD=d.reduce((p,x)=>p*x,1); return sumD===prodD?'Spy':'Not Spy'; };

// HM100
module.exports['HM100'] = (inp)=>{ const lines=inp.trim().split('\n'); const n=Number(lines[0]); const students=[]; for(let i=0;i<n;i++){const p=lines[i+1].trim().split(/\s+/);students.push({name:p[0],marks:Number(p[1])});} students.sort((a,b)=>b.marks-a.marks); return students.map(s=>`${s.name} ${s.marks}`).join('\n'); };
