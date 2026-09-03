/**
 * generateData.js
 * Master script: generates all data files for 100 HeyMine questions.
 * Run once with: node scripts/generateData.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, typeof content === 'string' ? content : JSON.stringify(content, null, 2), 'utf8');
  console.log('  ✓', path.relative(ROOT, filePath));
}

// ─── Complete 100-question catalogue ────────────────────────────────────────
const QUESTIONS = [
  // STAGE 1 — Programming Fundamentals (HM001–HM020)
  { id:'HM001', title:'Hello World',               stage:1, mission:1,  difficulty:'Beginner',     xp:10, coins:20, boss:false },
  { id:'HM002', title:'Print Your Name',           stage:1, mission:2,  difficulty:'Beginner',     xp:10, coins:20, boss:false },
  { id:'HM003', title:'Print Multiple Lines',      stage:1, mission:3,  difficulty:'Beginner',     xp:10, coins:20, boss:false },
  { id:'HM004', title:'Read and Print Integer',    stage:1, mission:4,  difficulty:'Beginner',     xp:10, coins:20, boss:false },
  { id:'HM005', title:'Read and Print String',     stage:1, mission:5,  difficulty:'Beginner',     xp:10, coins:20, boss:false },
  { id:'HM006', title:'Add Two Numbers',           stage:1, mission:6,  difficulty:'Beginner',     xp:10, coins:20, boss:false },
  { id:'HM007', title:'Subtract Two Numbers',      stage:1, mission:7,  difficulty:'Beginner',     xp:10, coins:20, boss:false },
  { id:'HM008', title:'Multiply Two Numbers',      stage:1, mission:8,  difficulty:'Beginner',     xp:10, coins:20, boss:false },
  { id:'HM009', title:'Divide Two Numbers',        stage:1, mission:9,  difficulty:'Beginner',     xp:10, coins:20, boss:false },
  { id:'HM010', title:'Modulus Operation',         stage:1, mission:10, difficulty:'Beginner',     xp:10, coins:20, boss:false },
  { id:'HM011', title:'Swap Two Numbers',          stage:1, mission:11, difficulty:'Beginner',     xp:10, coins:20, boss:false },
  { id:'HM012', title:'Area of Rectangle',         stage:1, mission:12, difficulty:'Beginner',     xp:10, coins:20, boss:false },
  { id:'HM013', title:'Area of Circle',            stage:1, mission:13, difficulty:'Beginner',     xp:10, coins:20, boss:false },
  { id:'HM014', title:'Celsius to Fahrenheit',     stage:1, mission:14, difficulty:'Beginner',     xp:10, coins:20, boss:false },
  { id:'HM015', title:'Fahrenheit to Celsius',     stage:1, mission:15, difficulty:'Beginner',     xp:10, coins:20, boss:false },
  { id:'HM016', title:'Average of Three Numbers',  stage:1, mission:16, difficulty:'Beginner',     xp:10, coins:20, boss:false },
  { id:'HM017', title:'Square and Cube',           stage:1, mission:17, difficulty:'Beginner',     xp:10, coins:20, boss:false },
  { id:'HM018', title:'ASCII Value of Character',  stage:1, mission:18, difficulty:'Beginner',     xp:10, coins:20, boss:false },
  { id:'HM019', title:'Increment & Decrement',     stage:1, mission:19, difficulty:'Beginner',     xp:10, coins:20, boss:false },
  { id:'HM020', title:'Mini Calculator',           stage:1, mission:20, difficulty:'Beginner',     xp:10, coins:20, boss:true  },
  // STAGE 2 — Logic & Loops (HM021–HM040)
  { id:'HM021', title:'Even or Odd',               stage:2, mission:21, difficulty:'Beginner',     xp:15, coins:30, boss:false },
  { id:'HM022', title:'Positive, Negative or Zero',stage:2, mission:22, difficulty:'Beginner',     xp:15, coins:30, boss:false },
  { id:'HM023', title:'Largest of Two',            stage:2, mission:23, difficulty:'Beginner',     xp:15, coins:30, boss:false },
  { id:'HM024', title:'Largest of Three',          stage:2, mission:24, difficulty:'Beginner',     xp:15, coins:30, boss:false },
  { id:'HM025', title:'Leap Year',                 stage:2, mission:25, difficulty:'Beginner',     xp:15, coins:30, boss:false },
  { id:'HM026', title:'Voting Eligibility',        stage:2, mission:26, difficulty:'Beginner',     xp:15, coins:30, boss:false },
  { id:'HM027', title:'Grade Calculator',          stage:2, mission:27, difficulty:'Beginner',     xp:15, coins:30, boss:false },
  { id:'HM028', title:'Calculator using Switch',   stage:2, mission:28, difficulty:'Beginner',     xp:15, coins:30, boss:false },
  { id:'HM029', title:'Print Numbers 1 to N',      stage:2, mission:29, difficulty:'Beginner',     xp:15, coins:30, boss:false },
  { id:'HM030', title:'Print N to 1',              stage:2, mission:30, difficulty:'Beginner',     xp:15, coins:30, boss:false },
  { id:'HM031', title:'Sum of N Numbers',          stage:2, mission:31, difficulty:'Beginner',     xp:15, coins:30, boss:false },
  { id:'HM032', title:'Factorial',                 stage:2, mission:32, difficulty:'Beginner',     xp:15, coins:30, boss:false },
  { id:'HM033', title:'Multiplication Table',      stage:2, mission:33, difficulty:'Beginner',     xp:15, coins:30, boss:false },
  { id:'HM034', title:'Fibonacci Series',          stage:2, mission:34, difficulty:'Beginner',     xp:15, coins:30, boss:false },
  { id:'HM035', title:'Prime Number',              stage:2, mission:35, difficulty:'Beginner',     xp:15, coins:30, boss:false },
  { id:'HM036', title:'Armstrong Number',          stage:2, mission:36, difficulty:'Beginner',     xp:15, coins:30, boss:false },
  { id:'HM037', title:'Palindrome Number',         stage:2, mission:37, difficulty:'Beginner',     xp:15, coins:30, boss:false },
  { id:'HM038', title:'Reverse Number',            stage:2, mission:38, difficulty:'Beginner',     xp:15, coins:30, boss:false },
  { id:'HM039', title:'Count Digits',              stage:2, mission:39, difficulty:'Beginner',     xp:15, coins:30, boss:false },
  { id:'HM040', title:'Sum of Digits',             stage:2, mission:40, difficulty:'Beginner',     xp:15, coins:30, boss:true  },
  // STAGE 3 — Patterns & Functions (HM041–HM060)
  { id:'HM041', title:'Square Star Pattern',       stage:3, mission:41, difficulty:'Intermediate', xp:20, coins:40, boss:false },
  { id:'HM042', title:'Right Triangle Pattern',    stage:3, mission:42, difficulty:'Intermediate', xp:20, coins:40, boss:false },
  { id:'HM043', title:'Inverted Triangle',         stage:3, mission:43, difficulty:'Intermediate', xp:20, coins:40, boss:false },
  { id:'HM044', title:'Pyramid Pattern',           stage:3, mission:44, difficulty:'Intermediate', xp:20, coins:40, boss:false },
  { id:'HM045', title:'Inverted Pyramid',          stage:3, mission:45, difficulty:'Intermediate', xp:20, coins:40, boss:false },
  { id:'HM046', title:'Diamond Pattern',           stage:3, mission:46, difficulty:'Intermediate', xp:20, coins:40, boss:false },
  { id:'HM047', title:'Hollow Square',             stage:3, mission:47, difficulty:'Intermediate', xp:20, coins:40, boss:false },
  { id:'HM048', title:'Number Triangle',           stage:3, mission:48, difficulty:'Intermediate', xp:20, coins:40, boss:false },
  { id:'HM049', title:'Floyd Triangle',            stage:3, mission:49, difficulty:'Intermediate', xp:20, coins:40, boss:false },
  { id:'HM050', title:'Pascal Triangle',           stage:3, mission:50, difficulty:'Intermediate', xp:20, coins:40, boss:false },
  { id:'HM051', title:'Function - Add',            stage:3, mission:51, difficulty:'Intermediate', xp:20, coins:40, boss:false },
  { id:'HM052', title:'Function - Maximum',        stage:3, mission:52, difficulty:'Intermediate', xp:20, coins:40, boss:false },
  { id:'HM053', title:'Function - Factorial',      stage:3, mission:53, difficulty:'Intermediate', xp:20, coins:40, boss:false },
  { id:'HM054', title:'Function - Prime Check',    stage:3, mission:54, difficulty:'Intermediate', xp:20, coins:40, boss:false },
  { id:'HM055', title:'Function - Fibonacci',      stage:3, mission:55, difficulty:'Intermediate', xp:20, coins:40, boss:false },
  { id:'HM056', title:'Recursive Factorial',       stage:3, mission:56, difficulty:'Intermediate', xp:20, coins:40, boss:false },
  { id:'HM057', title:'Recursive Fibonacci',       stage:3, mission:57, difficulty:'Intermediate', xp:20, coins:40, boss:false },
  { id:'HM058', title:'GCD using Function',        stage:3, mission:58, difficulty:'Intermediate', xp:20, coins:40, boss:false },
  { id:'HM059', title:'LCM using Function',        stage:3, mission:59, difficulty:'Intermediate', xp:20, coins:40, boss:false },
  { id:'HM060', title:'Power Function',            stage:3, mission:60, difficulty:'Intermediate', xp:20, coins:40, boss:true  },
  // STAGE 4 — Arrays & Strings (HM061–HM080)
  { id:'HM061', title:'Input Array',              stage:4, mission:61, difficulty:'Intermediate', xp:25, coins:50, boss:false },
  { id:'HM062', title:'Print Array',             stage:4, mission:62, difficulty:'Intermediate', xp:25, coins:50, boss:false },
  { id:'HM063', title:'Sum of Array',            stage:4, mission:63, difficulty:'Intermediate', xp:25, coins:50, boss:false },
  { id:'HM064', title:'Average of Array',        stage:4, mission:64, difficulty:'Intermediate', xp:25, coins:50, boss:false },
  { id:'HM065', title:'Maximum Element',         stage:4, mission:65, difficulty:'Intermediate', xp:25, coins:50, boss:false },
  { id:'HM066', title:'Minimum Element',         stage:4, mission:66, difficulty:'Intermediate', xp:25, coins:50, boss:false },
  { id:'HM067', title:'Second Largest',          stage:4, mission:67, difficulty:'Intermediate', xp:25, coins:50, boss:false },
  { id:'HM068', title:'Reverse Array',           stage:4, mission:68, difficulty:'Intermediate', xp:25, coins:50, boss:false },
  { id:'HM069', title:'Linear Search',           stage:4, mission:69, difficulty:'Intermediate', xp:25, coins:50, boss:false },
  { id:'HM070', title:'Count Even & Odd',        stage:4, mission:70, difficulty:'Intermediate', xp:25, coins:50, boss:false },
  { id:'HM071', title:'String Length',           stage:4, mission:71, difficulty:'Intermediate', xp:25, coins:50, boss:false },
  { id:'HM072', title:'Reverse String',          stage:4, mission:72, difficulty:'Intermediate', xp:25, coins:50, boss:false },
  { id:'HM073', title:'Palindrome String',       stage:4, mission:73, difficulty:'Intermediate', xp:25, coins:50, boss:false },
  { id:'HM074', title:'Count Vowels',            stage:4, mission:74, difficulty:'Intermediate', xp:25, coins:50, boss:false },
  { id:'HM075', title:'Count Words',             stage:4, mission:75, difficulty:'Intermediate', xp:25, coins:50, boss:false },
  { id:'HM076', title:'Toggle Case',             stage:4, mission:76, difficulty:'Intermediate', xp:25, coins:50, boss:false },
  { id:'HM077', title:'Remove Spaces',           stage:4, mission:77, difficulty:'Intermediate', xp:25, coins:50, boss:false },
  { id:'HM078', title:'Character Frequency',     stage:4, mission:78, difficulty:'Intermediate', xp:25, coins:50, boss:false },
  { id:'HM079', title:'Compare Strings',         stage:4, mission:79, difficulty:'Intermediate', xp:25, coins:50, boss:false },
  { id:'HM080', title:'Anagram Check',           stage:4, mission:80, difficulty:'Intermediate', xp:25, coins:50, boss:true  },
  // STAGE 5 — Algorithms & Problem Solving (HM081–HM100)
  { id:'HM081', title:'Bubble Sort',             stage:5, mission:81, difficulty:'Advanced', xp:30, coins:60, boss:false },
  { id:'HM082', title:'Selection Sort',          stage:5, mission:82, difficulty:'Advanced', xp:30, coins:60, boss:false },
  { id:'HM083', title:'Insertion Sort',          stage:5, mission:83, difficulty:'Advanced', xp:30, coins:60, boss:false },
  { id:'HM084', title:'Binary Search',           stage:5, mission:84, difficulty:'Advanced', xp:30, coins:60, boss:false },
  { id:'HM085', title:'Merge Two Arrays',        stage:5, mission:85, difficulty:'Advanced', xp:30, coins:60, boss:false },
  { id:'HM086', title:'Remove Duplicates',       stage:5, mission:86, difficulty:'Advanced', xp:30, coins:60, boss:false },
  { id:'HM087', title:'Frequency of Elements',   stage:5, mission:87, difficulty:'Advanced', xp:30, coins:60, boss:false },
  { id:'HM088', title:'Missing Number',          stage:5, mission:88, difficulty:'Advanced', xp:30, coins:60, boss:false },
  { id:'HM089', title:'Rotate Array',            stage:5, mission:89, difficulty:'Advanced', xp:30, coins:60, boss:false },
  { id:'HM090', title:'Prefix Sum',              stage:5, mission:90, difficulty:'Advanced', xp:30, coins:60, boss:false },
  { id:'HM091', title:'Decimal to Binary',       stage:5, mission:91, difficulty:'Advanced', xp:30, coins:60, boss:false },
  { id:'HM092', title:'Binary to Decimal',       stage:5, mission:92, difficulty:'Advanced', xp:30, coins:60, boss:false },
  { id:'HM093', title:'GCD',                     stage:5, mission:93, difficulty:'Advanced', xp:30, coins:60, boss:false },
  { id:'HM094', title:'LCM',                     stage:5, mission:94, difficulty:'Advanced', xp:30, coins:60, boss:false },
  { id:'HM095', title:'Perfect Number',          stage:5, mission:95, difficulty:'Advanced', xp:30, coins:60, boss:false },
  { id:'HM096', title:'Strong Number',           stage:5, mission:96, difficulty:'Advanced', xp:30, coins:60, boss:false },
  { id:'HM097', title:'Automorphic Number',      stage:5, mission:97, difficulty:'Advanced', xp:30, coins:60, boss:false },
  { id:'HM098', title:'Neon Number',             stage:5, mission:98, difficulty:'Advanced', xp:30, coins:60, boss:false },
  { id:'HM099', title:'Spy Number',              stage:5, mission:99, difficulty:'Advanced', xp:30, coins:60, boss:false },
  { id:'HM100', title:'Mini Student Management', stage:5, mission:100,difficulty:'Advanced', xp:30, coins:60, boss:true  },
];

const STAGE_NAMES = {
  1:'🌱 Programming Village',
  2:'🌿 Logic Forest',
  3:'🏔 Pattern Mountain',
  4:'🏙 Data City',
  5:'👑 Algorithm Kingdom',
};

// ─── Reference solutions (pure JS, same logic as student code) ─────────────
const SOLUTIONS = {
HM001:(inp)=>'Hello World',
HM002:(inp)=>{ const name=inp.trim(); return name; },
HM003:(inp)=>'Line 1\nLine 2\nLine 3',
HM004:(inp)=>inp.trim(),
HM005:(inp)=>inp.trim(),
HM006:(inp)=>{ const [a,b]=inp.trim().split(/\s+/).map(Number); return String(a+b); },
HM007:(inp)=>{ const [a,b]=inp.trim().split(/\s+/).map(Number); return String(a-b); },
HM008:(inp)=>{ const [a,b]=inp.trim().split(/\s+/).map(Number); return String(a*b); },
HM009:(inp)=>{ const [a,b]=inp.trim().split(/\s+/).map(Number); return String(Math.floor(a/b)); },
HM010:(inp)=>{ const [a,b]=inp.trim().split(/\s+/).map(Number); return String(a%b); },
HM011:(inp)=>{ const [a,b]=inp.trim().split(/\s+/).map(Number); return `${b} ${a}`; },
HM012:(inp)=>{ const [l,w]=inp.trim().split(/\s+/).map(Number); return String(l*w); },
HM013:(inp)=>{ const r=Number(inp.trim()); return (Math.PI*r*r).toFixed(2); },
HM014:(inp)=>{ const c=Number(inp.trim()); return ((c*9/5)+32).toFixed(2); },
HM015:(inp)=>{ const f=Number(inp.trim()); return (((f-32)*5)/9).toFixed(2); },
HM016:(inp)=>{ const [a,b,c]=inp.trim().split(/\s+/).map(Number); return ((a+b+c)/3).toFixed(2); },
HM017:(inp)=>{ const n=Number(inp.trim()); return `${n*n} ${n*n*n}`; },
HM018:(inp)=>{ const ch=inp.trim()[0]; return String(ch.charCodeAt(0)); },
HM019:(inp)=>{ const n=Number(inp.trim()); return `${n+1} ${n-1}`; },
HM020:(inp)=>{ const parts=inp.trim().split(/\s+/); const a=Number(parts[0]),op=parts[1],b=Number(parts[2]); if(op==='+')return String(a+b); if(op==='-')return String(a-b); if(op==='*')return String(a*b); if(op==='/')return b===0?'Error':String(Math.floor(a/b)); return 'Error'; },
HM021:(inp)=>{ const n=Number(inp.trim()); return n%2===0?'Even':'Odd'; },
HM022:(inp)=>{ const n=Number(inp.trim()); return n>0?'Positive':n<0?'Negative':'Zero'; },
HM023:(inp)=>{ const [a,b]=inp.trim().split(/\s+/).map(Number); return String(Math.max(a,b)); },
HM024:(inp)=>{ const [a,b,c]=inp.trim().split(/\s+/).map(Number); return String(Math.max(a,b,c)); },
HM025:(inp)=>{ const y=Number(inp.trim()); return (y%4===0&&(y%100!==0||y%400===0))?'Leap Year':'Not a Leap Year'; },
HM026:(inp)=>{ const a=Number(inp.trim()); return a>=18?'Eligible':'Not Eligible'; },
HM027:(inp)=>{ const m=Number(inp.trim()); if(m>=90)return 'A'; if(m>=80)return 'B'; if(m>=70)return 'C'; if(m>=60)return 'D'; return 'F'; },
HM028:(inp)=>{ const parts=inp.trim().split(/\s+/); const a=Number(parts[0]),op=parts[1],b=Number(parts[2]); if(op==='+')return String(a+b); if(op==='-')return String(a-b); if(op==='*')return String(a*b); if(op==='/')return b===0?'Error':String(Math.floor(a/b)); return 'Invalid'; },
HM029:(inp)=>{ const n=Number(inp.trim()); return Array.from({length:n},(_,i)=>i+1).join(' '); },
HM030:(inp)=>{ const n=Number(inp.trim()); return Array.from({length:n},(_,i)=>n-i).join(' '); },
HM031:(inp)=>{ const lines=inp.trim().split('\n'); const n=Number(lines[0]); const nums=lines[1].trim().split(/\s+/).map(Number); return String(nums.reduce((s,x)=>s+x,0)); },
HM032:(inp)=>{ const n=Number(inp.trim()); let f=1; for(let i=2;i<=n;i++)f*=i; return String(f); },
HM033:(inp)=>{ const [n,r]=inp.trim().split(/\s+/).map(Number); const lines=[]; for(let i=1;i<=r;i++)lines.push(`${n} x ${i} = ${n*i}`); return lines.join('\n'); },
HM034:(inp)=>{ const n=Number(inp.trim()); let a=0,b=1; const res=[]; for(let i=0;i<n;i++){res.push(a);[a,b]=[b,a+b];} return res.join(' '); },
HM035:(inp)=>{ const n=Number(inp.trim()); if(n<2)return 'Not Prime'; for(let i=2;i<=Math.sqrt(n);i++)if(n%i===0)return 'Not Prime'; return 'Prime'; },
HM036:(inp)=>{ const n=Number(inp.trim()); const d=String(n).length; const s=String(n).split('').reduce((acc,c)=>acc+Math.pow(Number(c),d),0); return s===n?'Armstrong':'Not Armstrong'; },
HM037:(inp)=>{ const n=Number(inp.trim()); return String(n)===String(n).split('').reverse().join('')?'Palindrome':'Not Palindrome'; },
HM038:(inp)=>{ const n=Number(inp.trim()); return String(n).split('').reverse().join('').replace(/^0+/,'')||'0'; },
HM039:(inp)=>{ const n=Number(inp.trim()); return String(Math.abs(n)).length; },
HM040:(inp)=>{ const n=Number(inp.trim()); return String(String(Math.abs(n)).split('').reduce((s,c)=>s+Number(c),0)); },
HM041:(inp)=>{ const n=Number(inp.trim()); return Array.from({length:n},()=>'*'.repeat(n)).join('\n'); },
HM042:(inp)=>{ const n=Number(inp.trim()); return Array.from({length:n},(_,i)=>'*'.repeat(i+1)).join('\n'); },
HM043:(inp)=>{ const n=Number(inp.trim()); return Array.from({length:n},(_,i)=>'*'.repeat(n-i)).join('\n'); },
HM044:(inp)=>{ const n=Number(inp.trim()); return Array.from({length:n},(_,i)=>' '.repeat(n-i-1)+'*'.repeat(2*i+1)).join('\n'); },
HM045:(inp)=>{ const n=Number(inp.trim()); return Array.from({length:n},(_,i)=>' '.repeat(i)+'*'.repeat(2*(n-i)-1)).join('\n'); },
HM046:(inp)=>{ const n=Number(inp.trim()); const top=Array.from({length:n},(_,i)=>' '.repeat(n-i-1)+'*'.repeat(2*i+1)); const bot=Array.from({length:n-1},(_,i)=>' '.repeat(i+1)+'*'.repeat(2*(n-i-1)-1)); return [...top,...bot].join('\n'); },
HM047:(inp)=>{ const n=Number(inp.trim()); return Array.from({length:n},(_,i)=>(i===0||i===n-1)?'*'.repeat(n):'*'+' '.repeat(n-2)+'*').join('\n'); },
HM048:(inp)=>{ const n=Number(inp.trim()); return Array.from({length:n},(_,i)=>Array.from({length:i+1},(_,j)=>j+1).join(' ')).join('\n'); },
HM049:(inp)=>{ const n=Number(inp.trim()); let k=1; return Array.from({length:n},(_,i)=>{ const row=Array.from({length:i+1},()=>k++); return row.join(' '); }).join('\n'); },
HM050:(inp)=>{ const n=Number(inp.trim()); return Array.from({length:n},(_,i)=>{ let row=[1]; for(let j=1;j<=i;j++)row.push(row[j-1]*(i-j+1)/j|0); return row.join(' '); }).join('\n'); },
HM051:(inp)=>{ const [a,b]=inp.trim().split(/\s+/).map(Number); return String(a+b); },
HM052:(inp)=>{ const [a,b]=inp.trim().split(/\s+/).map(Number); return String(Math.max(a,b)); },
HM053:(inp)=>{ const n=Number(inp.trim()); let f=1; for(let i=2;i<=n;i++)f*=i; return String(f); },
HM054:(inp)=>{ const n=Number(inp.trim()); if(n<2)return 'Not Prime'; for(let i=2;i<=Math.sqrt(n);i++)if(n%i===0)return 'Not Prime'; return 'Prime'; },
HM055:(inp)=>{ const n=Number(inp.trim()); let a=0,b=1; const res=[]; for(let i=0;i<n;i++){res.push(a);[a,b]=[b,a+b];} return res.join(' '); },
HM056:(inp)=>{ function fact(n){return n<=1?1:n*fact(n-1);} return String(fact(Number(inp.trim()))); },
HM057:(inp)=>{ function fib(n){return n<=1?n:fib(n-1)+fib(n-2);} const n=Number(inp.trim()); return Array.from({length:n},(_,i)=>fib(i)).join(' '); },
HM058:(inp)=>{ function gcd(a,b){return b===0?a:gcd(b,a%b);} const [a,b]=inp.trim().split(/\s+/).map(Number); return String(gcd(a,b)); },
HM059:(inp)=>{ function gcd(a,b){return b===0?a:gcd(b,a%b);} const [a,b]=inp.trim().split(/\s+/).map(Number); return String((a*b)/gcd(a,b)); },
HM060:(inp)=>{ const [b,e]=inp.trim().split(/\s+/).map(Number); return String(Math.pow(b,e)); },
HM061:(inp)=>{ const lines=inp.trim().split('\n'); const n=Number(lines[0]); const nums=lines[1].trim().split(/\s+/).map(Number); return nums.join(' '); },
HM062:(inp)=>{ const lines=inp.trim().split('\n'); return lines[1].trim().split(/\s+/).join(' '); },
HM063:(inp)=>{ const lines=inp.trim().split('\n'); const nums=lines[1].trim().split(/\s+/).map(Number); return String(nums.reduce((s,x)=>s+x,0)); },
HM064:(inp)=>{ const lines=inp.trim().split('\n'); const nums=lines[1].trim().split(/\s+/).map(Number); return (nums.reduce((s,x)=>s+x,0)/nums.length).toFixed(2); },
HM065:(inp)=>{ const lines=inp.trim().split('\n'); const nums=lines[1].trim().split(/\s+/).map(Number); return String(Math.max(...nums)); },
HM066:(inp)=>{ const lines=inp.trim().split('\n'); const nums=lines[1].trim().split(/\s+/).map(Number); return String(Math.min(...nums)); },
HM067:(inp)=>{ const lines=inp.trim().split('\n'); const nums=lines[1].trim().split(/\s+/).map(Number).sort((a,b)=>b-a); return String(nums[1]); },
HM068:(inp)=>{ const lines=inp.trim().split('\n'); const nums=lines[1].trim().split(/\s+/); return nums.reverse().join(' '); },
HM069:(inp)=>{ const lines=inp.trim().split('\n'); const nums=lines[1].trim().split(/\s+/).map(Number); const t=Number(lines[2]); const idx=nums.indexOf(t); return idx===-1?'-1':String(idx); },
HM070:(inp)=>{ const lines=inp.trim().split('\n'); const nums=lines[1].trim().split(/\s+/).map(Number); const e=nums.filter(x=>x%2===0).length; return `${e} ${nums.length-e}`; },
HM071:(inp)=>{ return String(inp.trim().length); },
HM072:(inp)=>{ return inp.trim().split('').reverse().join(''); },
HM073:(inp)=>{ const s=inp.trim(); return s===s.split('').reverse().join('')?'Palindrome':'Not Palindrome'; },
HM074:(inp)=>{ const s=inp.trim().toLowerCase(); return String([...s].filter(c=>'aeiou'.includes(c)).length); },
HM075:(inp)=>{ return String(inp.trim().split(/\s+/).length); },
HM076:(inp)=>{ return [...inp.trim()].map(c=>c===c.toUpperCase()?c.toLowerCase():c.toUpperCase()).join(''); },
HM077:(inp)=>{ return inp.trim().replace(/\s+/g,''); },
HM078:(inp)=>{ const s=inp.trim(); const freq={}; for(const c of s)freq[c]=(freq[c]||0)+1; return Object.entries(freq).sort((a,b)=>a[0].localeCompare(b[0])).map(([c,f])=>`${c}:${f}`).join('\n'); },
HM079:(inp)=>{ const [a,b]=inp.trim().split('\n'); return a.trim()===b.trim()?'Equal':'Not Equal'; },
HM080:(inp)=>{ const [a,b]=inp.trim().split('\n'); const sort=s=>[...s.trim().toLowerCase()].sort().join(''); return sort(a)===sort(b)?'Anagram':'Not Anagram'; },
HM081:(inp)=>{ const lines=inp.trim().split('\n'); const a=lines[1].trim().split(/\s+/).map(Number); for(let i=0;i<a.length;i++)for(let j=0;j<a.length-i-1;j++)if(a[j]>a[j+1])[a[j],a[j+1]]=[a[j+1],a[j]]; return a.join(' '); },
HM082:(inp)=>{ const lines=inp.trim().split('\n'); const a=lines[1].trim().split(/\s+/).map(Number); for(let i=0;i<a.length;i++){let m=i;for(let j=i+1;j<a.length;j++)if(a[j]<a[m])m=j;[a[i],a[m]]=[a[m],a[i]];} return a.join(' '); },
HM083:(inp)=>{ const lines=inp.trim().split('\n'); const a=lines[1].trim().split(/\s+/).map(Number); for(let i=1;i<a.length;i++){const k=a[i];let j=i-1;while(j>=0&&a[j]>k){a[j+1]=a[j];j--;}a[j+1]=k;} return a.join(' '); },
HM084:(inp)=>{ const lines=inp.trim().split('\n'); const a=lines[1].trim().split(/\s+/).map(Number).sort((x,y)=>x-y); const t=Number(lines[2]); let lo=0,hi=a.length-1,res=-1; while(lo<=hi){const mid=(lo+hi)>>1;if(a[mid]===t){res=mid;break;}else if(a[mid]<t)lo=mid+1;else hi=mid-1;} return String(res); },
HM085:(inp)=>{ const lines=inp.trim().split('\n'); const a=lines[1].trim().split(/\s+/).map(Number); const b=lines[3].trim().split(/\s+/).map(Number); return [...a,...b].sort((x,y)=>x-y).join(' '); },
HM086:(inp)=>{ const lines=inp.trim().split('\n'); const a=[...new Set(lines[1].trim().split(/\s+/).map(Number))]; return a.join(' '); },
HM087:(inp)=>{ const lines=inp.trim().split('\n'); const a=lines[1].trim().split(/\s+/).map(Number); const freq={}; for(const x of a)freq[x]=(freq[x]||0)+1; return Object.entries(freq).map(([k,v])=>`${k}:${v}`).join('\n'); },
HM088:(inp)=>{ const lines=inp.trim().split('\n'); const n=Number(lines[0]); const a=lines[1].trim().split(/\s+/).map(Number); const expected=n*(n+1)/2; return String(expected-a.reduce((s,x)=>s+x,0)); },
HM089:(inp)=>{ const lines=inp.trim().split('\n'); const a=lines[1].trim().split(/\s+/).map(Number); const k=Number(lines[2])%a.length; return [...a.slice(k),...a.slice(0,k)].join(' '); },
HM090:(inp)=>{ const lines=inp.trim().split('\n'); const a=lines[1].trim().split(/\s+/).map(Number); let s=0; return a.map(x=>(s+=x,s)).join(' '); },
HM091:(inp)=>{ const n=Number(inp.trim()); return (n>>>0).toString(2); },
HM092:(inp)=>{ return String(parseInt(inp.trim(),2)); },
HM093:(inp)=>{ function gcd(a,b){return b===0?a:gcd(b,a%b);} const [a,b]=inp.trim().split(/\s+/).map(Number); return String(gcd(a,b)); },
HM094:(inp)=>{ function gcd(a,b){return b===0?a:gcd(b,a%b);} const [a,b]=inp.trim().split(/\s+/).map(Number); return String((a*b)/gcd(a,b)); },
HM095:(inp)=>{ const n=Number(inp.trim()); let s=0; for(let i=1;i<n;i++)if(n%i===0)s+=i; return s===n?'Perfect':'Not Perfect'; },
HM096:(inp)=>{ let fact=[1];for(let i=1;i<=9;i++)fact[i]=fact[i-1]*i; const n=Number(inp.trim()); const s=String(n).split('').reduce((acc,c)=>acc+fact[Number(c)],0); return s===n?'Strong':'Not Strong'; },
HM097:(inp)=>{ const n=Number(inp.trim()); const sq=n*n; return String(sq).endsWith(String(n))?'Automorphic':'Not Automorphic'; },
HM098:(inp)=>{ const n=Number(inp.trim()); const sq=n*n; const s=String(sq).split('').reduce((acc,c)=>acc+Number(c),0); return s===n?'Neon':'Not Neon'; },
HM099:(inp)=>{ const n=Number(inp.trim()); const d=String(n).split('').map(Number); const sumD=d.reduce((s,x)=>s+x,0); const prodD=d.reduce((p,x)=>p*x,1); return sumD===prodD?'Spy':'Not Spy'; },
HM100:(inp)=>{ const lines=inp.trim().split('\n'); const n=Number(lines[0]); const students=[]; for(let i=0;i<n;i++){const p=lines[i+1].trim().split(/\s+/);students.push({name:p[0],marks:Number(p[1])});} students.sort((a,b)=>b.marks-a.marks); return students.map(s=>`${s.name} ${s.marks}`).join('\n'); },
};

// ─── Generators — produce deterministic test inputs using LCG seed ──────────
function lcg(seed) {
  let s = seed;
  return () => { s = (1664525 * s + 1013904223) & 0xffffffff; return Math.abs(s); };
}

// Each generator returns { input, expected } pairs for given seed
const GENERATORS = {
HM001:(seed)=>({ input:'', expected:'Hello World' }),
HM002:(seed)=>{ const names=['Alice','Bob','Charlie','Diana','Eve','Frank','Grace','Heidi']; const n=names[lcg(seed)()%names.length]; return {input:n,expected:n}; },
HM003:(seed)=>({ input:'', expected:'Line 1\nLine 2\nLine 3' }),
HM004:(seed)=>{ const n=lcg(seed)()%1000; return {input:String(n),expected:String(n)}; },
HM005:(seed)=>{ const words=['Hello','World','Code','Learn','Python']; const w=words[lcg(seed)()%words.length]; return {input:w,expected:w}; },
HM006:(seed)=>{ const r=lcg(seed); const a=r()%100,b=r()%100; return {input:`${a} ${b}`,expected:String(a+b)}; },
HM007:(seed)=>{ const r=lcg(seed); const a=r()%100+10,b=r()%50; return {input:`${a} ${b}`,expected:String(a-b)}; },
HM008:(seed)=>{ const r=lcg(seed); const a=r()%20+1,b=r()%20+1; return {input:`${a} ${b}`,expected:String(a*b)}; },
HM009:(seed)=>{ const r=lcg(seed); const b=r()%10+1,a=b*(r()%10+1); return {input:`${a} ${b}`,expected:String(Math.floor(a/b))}; },
HM010:(seed)=>{ const r=lcg(seed); const b=r()%10+2,a=r()%100+b; return {input:`${a} ${b}`,expected:String(a%b)}; },
HM011:(seed)=>{ const r=lcg(seed); const a=r()%100,b=r()%100; return {input:`${a} ${b}`,expected:`${b} ${a}`}; },
HM012:(seed)=>{ const r=lcg(seed); const l=r()%20+1,w=r()%20+1; return {input:`${l} ${w}`,expected:String(l*w)}; },
HM013:(seed)=>{ const r=lcg(seed); const rad=(r()%20+1); const area=(Math.PI*rad*rad).toFixed(2); return {input:String(rad),expected:area}; },
HM014:(seed)=>{ const r=lcg(seed); const c=(r()%100)-20; return {input:String(c),expected:((c*9/5)+32).toFixed(2)}; },
HM015:(seed)=>{ const r=lcg(seed); const f=(r()%200)-50; return {input:String(f),expected:(((f-32)*5)/9).toFixed(2)}; },
HM016:(seed)=>{ const r=lcg(seed); const a=r()%100,b=r()%100,c=r()%100; return {input:`${a} ${b} ${c}`,expected:((a+b+c)/3).toFixed(2)}; },
HM017:(seed)=>{ const r=lcg(seed); const n=r()%15+1; return {input:String(n),expected:`${n*n} ${n*n*n}`}; },
HM018:(seed)=>{ const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'; const r=lcg(seed); const ch=chars[r()%chars.length]; return {input:ch,expected:String(ch.charCodeAt(0))}; },
HM019:(seed)=>{ const r=lcg(seed); const n=(r()%90)+5; return {input:String(n),expected:`${n+1} ${n-1}`}; },
HM020:(seed)=>{ const r=lcg(seed); const a=r()%50+1,b=r()%50+1; const ops=['+','-','*']; const op=ops[r()%ops.length]; const res=op==='+'?a+b:op==='-'?a-b:a*b; return {input:`${a} ${op} ${b}`,expected:String(res)}; },
HM021:(seed)=>{ const r=lcg(seed); const n=(r()%100)*((r()%2===0)?1:-1); return {input:String(n),expected:n%2===0?'Even':'Odd'}; },
HM022:(seed)=>{ const r=lcg(seed); const n=(r()%200)-100; return {input:String(n),expected:n>0?'Positive':n<0?'Negative':'Zero'}; },
HM023:(seed)=>{ const r=lcg(seed); const a=r()%100,b=r()%100; return {input:`${a} ${b}`,expected:String(Math.max(a,b))}; },
HM024:(seed)=>{ const r=lcg(seed); const a=r()%100,b=r()%100,c=r()%100; return {input:`${a} ${b} ${c}`,expected:String(Math.max(a,b,c))}; },
HM025:(seed)=>{ const years=[2000,2001,2004,1900,2024,2100,2023,2020,1996,2016]; const r=lcg(seed); const y=years[r()%years.length]; const isLeap=y%4===0&&(y%100!==0||y%400===0); return {input:String(y),expected:isLeap?'Leap Year':'Not a Leap Year'}; },
HM026:(seed)=>{ const r=lcg(seed); const a=r()%40+1; return {input:String(a),expected:a>=18?'Eligible':'Not Eligible'}; },
HM027:(seed)=>{ const r=lcg(seed); const m=r()%101; const g=m>=90?'A':m>=80?'B':m>=70?'C':m>=60?'D':'F'; return {input:String(m),expected:g}; },
HM028:(seed)=>{ const r=lcg(seed); const a=r()%50+1,b=r()%50+1; const ops=['+','-','*']; const op=ops[r()%ops.length]; const res=op==='+'?a+b:op==='-'?a-b:a*b; return {input:`${a} ${op} ${b}`,expected:String(res)}; },
HM029:(seed)=>{ const r=lcg(seed); const n=r()%10+3; return {input:String(n),expected:Array.from({length:n},(_,i)=>i+1).join(' ')}; },
HM030:(seed)=>{ const r=lcg(seed); const n=r()%10+3; return {input:String(n),expected:Array.from({length:n},(_,i)=>n-i).join(' ')}; },
HM031:(seed)=>{ const r=lcg(seed); const n=r()%8+3; const nums=Array.from({length:n},()=>r()%50-10); return {input:`${n}\n${nums.join(' ')}`,expected:String(nums.reduce((s,x)=>s+x,0))}; },
HM032:(seed)=>{ const factVals=[1,2,3,4,5,6,7,8,9,10]; const r=lcg(seed); const n=factVals[r()%factVals.length]; let f=1; for(let i=2;i<=n;i++)f*=i; return {input:String(n),expected:String(f)}; },
HM033:(seed)=>{ const r=lcg(seed); const n=r()%9+2,rows=r()%5+3; const lines=[]; for(let i=1;i<=rows;i++)lines.push(`${n} x ${i} = ${n*i}`); return {input:`${n} ${rows}`,expected:lines.join('\n')}; },
HM034:(seed)=>{ const r=lcg(seed); const n=r()%8+3; let a=0,b=1; const res=[]; for(let i=0;i<n;i++){res.push(a);[a,b]=[b,a+b];} return {input:String(n),expected:res.join(' ')}; },
HM035:(seed)=>{ const primes=[2,3,5,7,11,13,17,19,23,29,31,37]; const composites=[4,6,8,9,10,12,15,16,20,25]; const r=lcg(seed); const isPrime=r()%2===0; const pool=isPrime?primes:composites; const n=pool[r()%pool.length]; return {input:String(n),expected:isPrime?'Prime':'Not Prime'}; },
HM036:(seed)=>{ const armstrongs=[1,153,370,371,407]; const notArm=[2,10,100,200,500]; const r=lcg(seed); const isArm=r()%2===0; const pool=isArm?armstrongs:notArm; const n=pool[r()%pool.length]; return {input:String(n),expected:isArm?'Armstrong':'Not Armstrong'}; },
HM037:(seed)=>{ const pals=[121,131,1221,1001,9009]; const notPal=[123,456,789,100,200]; const r=lcg(seed); const isPal=r()%2===0; const pool=isPal?pals:notPal; const n=pool[r()%pool.length]; return {input:String(n),expected:isPal?'Palindrome':'Not Palindrome'}; },
HM038:(seed)=>{ const r=lcg(seed); const n=r()%9000+1000; const rev=String(n).split('').reverse().join('').replace(/^0+/,'')||'0'; return {input:String(n),expected:rev}; },
HM039:(seed)=>{ const r=lcg(seed); const n=r()%9000+10; return {input:String(n),expected:String(String(n).length)}; },
HM040:(seed)=>{ const r=lcg(seed); const n=r()%900+100; const s=String(n).split('').reduce((acc,c)=>acc+Number(c),0); return {input:String(n),expected:String(s)}; },
HM041:(seed)=>{ const r=lcg(seed); const n=r()%5+2; return {input:String(n),expected:Array.from({length:n},()=>'*'.repeat(n)).join('\n')}; },
HM042:(seed)=>{ const r=lcg(seed); const n=r()%5+2; return {input:String(n),expected:Array.from({length:n},(_,i)=>'*'.repeat(i+1)).join('\n')}; },
HM043:(seed)=>{ const r=lcg(seed); const n=r()%5+2; return {input:String(n),expected:Array.from({length:n},(_,i)=>'*'.repeat(n-i)).join('\n')}; },
HM044:(seed)=>{ const r=lcg(seed); const n=r()%5+2; return {input:String(n),expected:Array.from({length:n},(_,i)=>' '.repeat(n-i-1)+'*'.repeat(2*i+1)).join('\n')}; },
HM045:(seed)=>{ const r=lcg(seed); const n=r()%5+2; return {input:String(n),expected:Array.from({length:n},(_,i)=>' '.repeat(i)+'*'.repeat(2*(n-i)-1)).join('\n')}; },
HM046:(seed)=>{ const r=lcg(seed); const n=r()%4+2; const top=Array.from({length:n},(_,i)=>' '.repeat(n-i-1)+'*'.repeat(2*i+1)); const bot=Array.from({length:n-1},(_,i)=>' '.repeat(i+1)+'*'.repeat(2*(n-i-1)-1)); return {input:String(n),expected:[...top,...bot].join('\n')}; },
HM047:(seed)=>{ const r=lcg(seed); const n=r()%4+3; return {input:String(n),expected:Array.from({length:n},(_,i)=>(i===0||i===n-1)?'*'.repeat(n):'*'+' '.repeat(n-2)+'*').join('\n')}; },
HM048:(seed)=>{ const r=lcg(seed); const n=r()%5+2; return {input:String(n),expected:Array.from({length:n},(_,i)=>Array.from({length:i+1},(_,j)=>j+1).join(' ')).join('\n')}; },
HM049:(seed)=>{ const r=lcg(seed); const n=r()%5+2; let k=1; return {input:String(n),expected:Array.from({length:n},(_,i)=>{ const row=Array.from({length:i+1},()=>k++); return row.join(' '); }).join('\n')}; },
HM050:(seed)=>{ const r=lcg(seed); const n=r()%5+2; return {input:String(n),expected:Array.from({length:n},(_,i)=>{ let row=[1]; for(let j=1;j<=i;j++)row.push(row[j-1]*(i-j+1)/j|0); return row.join(' '); }).join('\n')}; },
HM051:(seed)=>{ const r=lcg(seed); const a=r()%100,b=r()%100; return {input:`${a} ${b}`,expected:String(a+b)}; },
HM052:(seed)=>{ const r=lcg(seed); const a=r()%100,b=r()%100; return {input:`${a} ${b}`,expected:String(Math.max(a,b))}; },
HM053:(seed)=>{ const vals=[1,2,3,4,5,6,7,8]; const r=lcg(seed); const n=vals[r()%vals.length]; let f=1; for(let i=2;i<=n;i++)f*=i; return {input:String(n),expected:String(f)}; },
HM054:(seed)=>{ const r=lcg(seed); const pool=[2,3,5,7,4,6,8,9,11,12,13]; const n=pool[r()%pool.length]; const isPrime=(n>=2&&[...Array(Math.floor(Math.sqrt(n))+1).keys()].slice(2).every(i=>n%i!==0)); return {input:String(n),expected:isPrime?'Prime':'Not Prime'}; },
HM055:(seed)=>{ const r=lcg(seed); const n=r()%7+3; let a=0,b=1; const res=[]; for(let i=0;i<n;i++){res.push(a);[a,b]=[b,a+b];} return {input:String(n),expected:res.join(' ')}; },
HM056:(seed)=>{ const vals=[1,2,3,4,5,6,7]; const r=lcg(seed); const n=vals[r()%vals.length]; let f=1; for(let i=2;i<=n;i++)f*=i; return {input:String(n),expected:String(f)}; },
HM057:(seed)=>{ const r=lcg(seed); const n=r()%6+3; function fib(k){return k<=1?k:fib(k-1)+fib(k-2);} return {input:String(n),expected:Array.from({length:n},(_,i)=>fib(i)).join(' ')}; },
HM058:(seed)=>{ const r=lcg(seed); const a=r()%50+2,b=r()%50+2; function gcd(x,y){return y===0?x:gcd(y,x%y);} return {input:`${a} ${b}`,expected:String(gcd(a,b))}; },
HM059:(seed)=>{ const r=lcg(seed); const a=r()%20+2,b=r()%20+2; function gcd(x,y){return y===0?x:gcd(y,x%y);} return {input:`${a} ${b}`,expected:String((a*b)/gcd(a,b))}; },
HM060:(seed)=>{ const r=lcg(seed); const b=r()%10+2,e=r()%5+1; return {input:`${b} ${e}`,expected:String(Math.pow(b,e))}; },
HM061:(seed)=>{ const r=lcg(seed); const n=r()%6+3; const nums=Array.from({length:n},()=>r()%50+1); return {input:`${n}\n${nums.join(' ')}`,expected:nums.join(' ')}; },
HM062:(seed)=>{ const r=lcg(seed); const n=r()%6+3; const nums=Array.from({length:n},()=>r()%50+1); return {input:`${n}\n${nums.join(' ')}`,expected:nums.join(' ')}; },
HM063:(seed)=>{ const r=lcg(seed); const n=r()%6+3; const nums=Array.from({length:n},()=>r()%50+1); return {input:`${n}\n${nums.join(' ')}`,expected:String(nums.reduce((s,x)=>s+x,0))}; },
HM064:(seed)=>{ const r=lcg(seed); const n=r()%6+3; const nums=Array.from({length:n},()=>r()%50+1); return {input:`${n}\n${nums.join(' ')}`,expected:(nums.reduce((s,x)=>s+x,0)/n).toFixed(2)}; },
HM065:(seed)=>{ const r=lcg(seed); const n=r()%6+3; const nums=Array.from({length:n},()=>r()%100+1); return {input:`${n}\n${nums.join(' ')}`,expected:String(Math.max(...nums))}; },
HM066:(seed)=>{ const r=lcg(seed); const n=r()%6+3; const nums=Array.from({length:n},()=>r()%100+1); return {input:`${n}\n${nums.join(' ')}`,expected:String(Math.min(...nums))}; },
HM067:(seed)=>{ const r=lcg(seed); const n=r()%5+4; const nums=[...new Set(Array.from({length:n+3},()=>r()%100+1))].slice(0,n); const sorted=[...nums].sort((a,b)=>b-a); return {input:`${n}\n${nums.join(' ')}`,expected:String(sorted[1])}; },
HM068:(seed)=>{ const r=lcg(seed); const n=r()%6+3; const nums=Array.from({length:n},()=>r()%50+1); return {input:`${n}\n${nums.join(' ')}`,expected:[...nums].reverse().join(' ')}; },
HM069:(seed)=>{ const r=lcg(seed); const n=r()%6+4; const nums=Array.from({length:n},()=>r()%50+1); const found=r()%2===0; const t=found?nums[r()%n]:r()%50+51; const idx=nums.indexOf(t); return {input:`${n}\n${nums.join(' ')}\n${t}`,expected:String(idx)}; },
HM070:(seed)=>{ const r=lcg(seed); const n=r()%6+4; const nums=Array.from({length:n},()=>r()%30+1); const e=nums.filter(x=>x%2===0).length; return {input:`${n}\n${nums.join(' ')}`,expected:`${e} ${n-e}`}; },
HM071:(seed)=>{ const words=['hello','world','programming','python','java','algorithm','data']; const r=lcg(seed); const w=words[r()%words.length]; return {input:w,expected:String(w.length)}; },
HM072:(seed)=>{ const words=['hello','world','python','java','code']; const r=lcg(seed); const w=words[r()%words.length]; return {input:w,expected:w.split('').reverse().join('')}; },
HM073:(seed)=>{ const pals=['racecar','madam','level','noon']; const notPals=['hello','world','python','java']; const r=lcg(seed); const isPal=r()%2===0; const pool=isPal?pals:notPals; const w=pool[r()%pool.length]; return {input:w,expected:isPal?'Palindrome':'Not Palindrome'}; },
HM074:(seed)=>{ const words=['programming','algorithm','data','structure','function']; const r=lcg(seed); const w=words[r()%words.length]; const v=[...w].filter(c=>'aeiou'.includes(c)).length; return {input:w,expected:String(v)}; },
HM075:(seed)=>{ const sentences=['hello world','how are you','good morning everyone','I love coding']; const r=lcg(seed); const s=sentences[r()%sentences.length]; return {input:s,expected:String(s.trim().split(/\s+/).length)}; },
HM076:(seed)=>{ const words=['Hello','wOrLd','Python','JAVA']; const r=lcg(seed); const w=words[r()%words.length]; return {input:w,expected:[...w].map(c=>c===c.toUpperCase()?c.toLowerCase():c.toUpperCase()).join('')}; },
HM077:(seed)=>{ const phrases=['h e l l o','w o r l d','p y t h o n','h e y m i n e']; const r=lcg(seed); const p=phrases[r()%phrases.length]; return {input:p,expected:p.replace(/\s+/g,'')}; },
HM078:(seed)=>{ const words=['aabbc','hello','programming','data']; const r=lcg(seed); const w=words[r()%words.length]; const freq={}; for(const c of w)freq[c]=(freq[c]||0)+1; const out=Object.entries(freq).sort((a,b)=>a[0].localeCompare(b[0])).map(([c,f])=>`${c}:${f}`).join('\n'); return {input:w,expected:out}; },
HM079:(seed)=>{ const pairs=[['hello','hello'],['world','word'],['java','java'],['python','Python']]; const r=lcg(seed); const [a,b]=pairs[r()%pairs.length]; return {input:`${a}\n${b}`,expected:a===b?'Equal':'Not Equal'}; },
HM080:(seed)=>{ const anagramPairs=[['listen','silent'],['hello','world'],['triangle','integral'],['cat','dog']]; const r=lcg(seed); const [a,b]=anagramPairs[r()%anagramPairs.length]; const sort=s=>[...s.toLowerCase()].sort().join(''); return {input:`${a}\n${b}`,expected:sort(a)===sort(b)?'Anagram':'Not Anagram'}; },
HM081:(seed)=>{ const r=lcg(seed); const n=r()%5+4; const nums=Array.from({length:n},()=>r()%50+1); const sorted=[...nums].sort((a,b)=>a-b); return {input:`${n}\n${nums.join(' ')}`,expected:sorted.join(' ')}; },
HM082:(seed)=>{ const r=lcg(seed); const n=r()%5+4; const nums=Array.from({length:n},()=>r()%50+1); const sorted=[...nums].sort((a,b)=>a-b); return {input:`${n}\n${nums.join(' ')}`,expected:sorted.join(' ')}; },
HM083:(seed)=>{ const r=lcg(seed); const n=r()%5+4; const nums=Array.from({length:n},()=>r()%50+1); const sorted=[...nums].sort((a,b)=>a-b); return {input:`${n}\n${nums.join(' ')}`,expected:sorted.join(' ')}; },
HM084:(seed)=>{ const r=lcg(seed); const n=r()%6+5; const nums=[...new Set(Array.from({length:n+5},()=>r()%100+1))].slice(0,n).sort((a,b)=>a-b); const found=r()%2===0; const t=found?nums[r()%n]:200+r()%50; const idx=nums.indexOf(t); return {input:`${n}\n${nums.join(' ')}\n${t}`,expected:String(idx)}; },
HM085:(seed)=>{ const r=lcg(seed); const n1=r()%4+3,n2=r()%4+3; const a=Array.from({length:n1},()=>r()%30+1); const b=Array.from({length:n2},()=>r()%30+1); const merged=[...a,...b].sort((x,y)=>x-y); return {input:`${n1}\n${a.join(' ')}\n${n2}\n${b.join(' ')}`,expected:merged.join(' ')}; },
HM086:(seed)=>{ const r=lcg(seed); const n=r()%5+5; const pool=[1,2,3,4,5,6,7,8]; const nums=Array.from({length:n},()=>pool[r()%pool.length]); const uniq=[...new Set(nums)]; return {input:`${n}\n${nums.join(' ')}`,expected:uniq.join(' ')}; },
HM087:(seed)=>{ const r=lcg(seed); const n=r()%5+4; const pool=[1,2,3,4,5]; const nums=Array.from({length:n},()=>pool[r()%pool.length]); const freq={}; for(const x of nums)freq[x]=(freq[x]||0)+1; const out=Object.entries(freq).map(([k,v])=>`${k}:${v}`).join('\n'); return {input:`${n}\n${nums.join(' ')}`,expected:out}; },
HM088:(seed)=>{ const r=lcg(seed); const n=r()%8+3; const missing=r()%n+1; const nums=Array.from({length:n},(_,i)=>i+1).filter(x=>x!==missing); const shuffled=nums.sort(()=>r()%2===0?1:-1); return {input:`${n}\n${shuffled.join(' ')}`,expected:String(missing)}; },
HM089:(seed)=>{ const r=lcg(seed); const n=r()%5+4; const nums=Array.from({length:n},()=>r()%20+1); const k=r()%n; const rotated=[...nums.slice(k),...nums.slice(0,k)]; return {input:`${n}\n${nums.join(' ')}\n${k}`,expected:rotated.join(' ')}; },
HM090:(seed)=>{ const r=lcg(seed); const n=r()%6+4; const nums=Array.from({length:n},()=>r()%20+1); let s=0; const prefix=nums.map(x=>(s+=x,s)); return {input:`${n}\n${nums.join(' ')}`,expected:prefix.join(' ')}; },
HM091:(seed)=>{ const r=lcg(seed); const n=r()%200+10; return {input:String(n),expected:(n>>>0).toString(2)}; },
HM092:(seed)=>{ const vals=['1010','1101','11111','10000','11001']; const r=lcg(seed); const b=vals[r()%vals.length]; return {input:b,expected:String(parseInt(b,2))}; },
HM093:(seed)=>{ const r=lcg(seed); const a=r()%50+2,b=r()%50+2; function gcd(x,y){return y===0?x:gcd(y,x%y);} return {input:`${a} ${b}`,expected:String(gcd(a,b))}; },
HM094:(seed)=>{ const r=lcg(seed); const a=r()%15+2,b=r()%15+2; function gcd(x,y){return y===0?x:gcd(y,x%y);} return {input:`${a} ${b}`,expected:String((a*b)/gcd(a,b))}; },
HM095:(seed)=>{ const perfects=[6,28,496]; const notPerf=[2,10,100,12,30]; const r=lcg(seed); const isPerfect=r()%2===0; const pool=isPerfect?perfects:notPerf; const n=pool[r()%pool.length]; return {input:String(n),expected:isPerfect?'Perfect':'Not Perfect'}; },
HM096:(seed)=>{ const strongs=[1,2,145,40585]; const notStr=[10,100,200,300]; const r=lcg(seed); const isStrong=r()%2===0; const pool=isStrong?strongs:notStr; const n=pool[r()%pool.length]; let fact=[1];for(let i=1;i<=9;i++)fact[i]=fact[i-1]*i; const s=String(n).split('').reduce((acc,c)=>acc+fact[Number(c)],0); return {input:String(n),expected:s===n?'Strong':'Not Strong'}; },
HM097:(seed)=>{ const autos=[1,5,6,25,76,376]; const notAuto=[2,10,23,30,100]; const r=lcg(seed); const isAuto=r()%2===0; const pool=isAuto?autos:notAuto; const n=pool[r()%pool.length]; const sq=n*n; return {input:String(n),expected:String(sq).endsWith(String(n))?'Automorphic':'Not Automorphic'}; },
HM098:(seed)=>{ const neons=[1,9]; const notNeon=[2,3,10,12,100]; const r=lcg(seed); const isNeon=r()%2===0; const pool=isNeon?neons:notNeon; const n=pool[r()%pool.length]; const sq=n*n; const s=String(sq).split('').reduce((acc,c)=>acc+Number(c),0); return {input:String(n),expected:s===n?'Neon':'Not Neon'}; },
HM099:(seed)=>{ const spies=[1,2,3,22,123]; const notSpy=[4,10,100,200,300]; const r=lcg(seed); const isSpy=r()%2===0; const pool=isSpy?spies:notSpy; const n=pool[r()%pool.length]; const d=String(n).split('').map(Number); const sumD=d.reduce((s,x)=>s+x,0),prodD=d.reduce((p,x)=>p*x,1); return {input:String(n),expected:sumD===prodD?'Spy':'Not Spy'}; },
HM100:(seed)=>{ const r=lcg(seed); const n=r()%3+3; const names=['Alice','Bob','Charlie','Diana','Eve','Frank']; const students=Array.from({length:n},(_,i)=>({name:names[i],marks:r()%101})); const sorted=[...students].sort((a,b)=>b.marks-a.marks); return {input:`${n}\n${students.map(s=>`${s.name} ${s.marks}`).join('\n')}`,expected:sorted.map(s=>`${s.name} ${s.marks}`).join('\n')}; },
};

// ─── Hints catalogue ─────────────────────────────────────────────────────────
const HINTS_DB = {
HM001:['Use print() in Python, System.out.println() in Java, printf in C/C++.','The output is exactly: Hello World (case-sensitive).','No input is needed — just print the string directly.'],
HM002:['Read a line from stdin, then print it as-is.','Use input() in Python, Scanner in Java, scanf in C.','The output should match the input name exactly.'],
HM003:['You need three separate print statements.','Each line is "Line 1", "Line 2", "Line 3".','No input is read for this problem.'],
HM004:['Read one integer from stdin.','Print the same integer back.','Use int in all languages.'],
HM005:['Read one word/string from stdin.','Print it back exactly as given.','No transformation needed.'],
HM006:['Read two integers on one line separated by space.','Use + operator.','The sum may exceed 32-bit int range — use long/int64 if needed.'],
HM007:['Read two integers a and b.','Compute a - b.','Order matters: first number minus second number.'],
HM008:['Read two integers and multiply them.','Use * operator.','The result may be large — consider larger data types.'],
HM009:['Read two integers a and b, compute a / b.','Use integer division (floor).','In Python use //, in C/Java use / with integers.'],
HM010:['Read two integers a and b.','Compute a % b (remainder).','Make sure b is not zero.'],
HM011:['Read a and b, print b then a.','Use two separate print statements or space-separated.','The order is REVERSED.'],
HM012:['Read length and width.','Area = length × width.','Result is an integer.'],
HM013:['Area = π × r².','Use 3.14159... for π or the language math library.','Print to 2 decimal places.'],
HM014:['Formula: F = (C × 9/5) + 32.','Read one number (Celsius).','Print to 2 decimal places.'],
HM015:['Formula: C = (F - 32) × 5/9.','Read one number (Fahrenheit).','Print to 2 decimal places.'],
HM016:['Read three numbers and compute (a+b+c)/3.','Use floating point division.','Print to 2 decimal places.'],
HM017:['Compute n*n and n*n*n.','Print both on one line separated by space.','Use ** or Math.pow().'],
HM018:['Read one character.','Print its ASCII value using ord() in Python or (int)ch in C/Java.','Every character has a unique ASCII code.'],
HM019:['Read one integer n.','Print n+1 and n-1 on one line.','Space-separated output.'],
HM020:['Read: number operator number (e.g., "5 + 3").','Handle +, -, *, / cases.','Use integer division for /.'],
HM021:['Check if n % 2 == 0.','Print "Even" or "Odd" (exact case).','Works for negative numbers too.'],
HM022:['Compare n with 0.','Print "Positive", "Negative", or "Zero".','Exact case matters.'],
HM023:['Use if-else to compare two numbers.','Print the larger one.','If equal, either is fine.'],
HM024:['Compare three numbers to find the largest.','Use nested if or max().','Only print the maximum value.'],
HM025:['A year is a leap year if divisible by 4, but not 100, unless also divisible by 400.','Check: (y%4==0 && (y%100!=0 || y%400==0)).','Print "Leap Year" or "Not a Leap Year".'],
HM026:['Check if age >= 18.','Print "Eligible" or "Not Eligible".','No extra text needed.'],
HM027:['Map score ranges to grades A,B,C,D,F.','>=90:A, >=80:B, >=70:C, >=60:D, else:F.','Print only the letter grade.'],
HM028:['Similar to HM020 but use switch/if-elif.','Handle +,-,*,/ cases.','Integer division for /.'],
HM029:['Use a loop from 1 to N.','Print all numbers space-separated on one line.','No trailing spaces needed.'],
HM030:['Loop from N down to 1.','Print in descending order, space-separated.','Use N, N-1, ... 1.'],
HM031:['Read N, then N numbers on next line.','Sum them all and print the total.','Watch for negative numbers.'],
HM032:['Factorial: n! = 1*2*3*...*n.','Use a loop, multiply as you go.','0! = 1 and 1! = 1.'],
HM033:['Read the number n and rows r.','Print n x 1 = n, n x 2 = 2n, ... up to r rows.','Format: "n x i = n*i".'],
HM034:['Start with 0 and 1, each next = sum of previous two.','Print first N numbers in the series.','0 1 1 2 3 5 8 ...'],
HM035:['Check divisibility from 2 to sqrt(n).','If any divisor found, it\'s not prime.','Numbers < 2 are not prime.'],
HM036:['An Armstrong number = sum of its digits^(number of digits) equals the number.','153 = 1³+5³+3³ = 153 ✓.','Count digits first, then raise each to that power.'],
HM037:['Reverse the number and compare with original.','Use string reversal or math reversal.','121 reversed = 121 → Palindrome.'],
HM038:['Reverse digits of the number.','Convert to string, reverse, remove leading zeros.','Return as a number.'],
HM039:['Count how many digits the number has.','Use len(str(n)) in Python.','Always positive (ignore sign).'],
HM040:['Extract each digit and sum them.','Use % 10 to get last digit, / 10 to remove it.','Sum = 1+2+3 for 123.'],
HM041:['Print n rows of n stars each.','Each row: ***** (n stars).','Use a nested loop.'],
HM042:['Row i has i stars (1-indexed).','Row 1: *, Row 2: **, etc.','Simple nested loop.'],
HM043:['Row i has (n-i+1) stars.','Starts with n stars, decreases by 1.','Inverted version of right triangle.'],
HM044:['Row i needs (n-i) spaces then (2i-1) stars.','Center each row with leading spaces.','Use string repetition.'],
HM045:['Row i needs i spaces then (2*(n-i)-1) stars.','This is the upside-down pyramid.','Last row has 1 star.'],
HM046:['Top half: pyramid rows 1..n, Bottom half: inverted rows n-1..1.','Mirror the pyramid.','Total rows = 2n-1.'],
HM047:['Top and bottom rows: all stars.','Middle rows: star + spaces + star.','Inner width = n-2 spaces.'],
HM048:['Row i contains numbers 1 to i.','1\n1 2\n1 2 3\n...','Simple nested loop.'],
HM049:['Floyd triangle: consecutive numbers row by row.','Start from 1, keep incrementing.','Row 1:1, Row 2:2 3, Row 3:4 5 6...'],
HM050:['Pascal triangle: each element = C(row, col).','Use previous row to compute current.','Row 0: 1, Row 1: 1 1, Row 2: 1 2 1...'],
HM051:['Define a function add(a, b) that returns a+b.','Call it and print the result.','Same as HM006 but with a function.'],
HM052:['Define a function max(a, b) using if-else.','Return the larger value.','Do not use built-in max.'],
HM053:['Define a function factorial(n) using a loop.','Multiply from 1 to n.','Return the result.'],
HM054:['Define isPrime(n) that returns "Prime" or "Not Prime".','Check divisors up to sqrt(n).','n < 2 is not prime.'],
HM055:['Define fibonacci(n) that returns first n Fibonacci numbers.','Return as space-separated string.','Start from 0 1 1 2 3...'],
HM056:['Use recursion: factorial(n) = n * factorial(n-1).','Base case: factorial(0) = 1.','Call the function recursively.'],
HM057:['Use recursion: fib(n) = fib(n-1) + fib(n-2).','Base cases: fib(0)=0, fib(1)=1.','Print first n values.'],
HM058:['GCD using Euclidean algorithm: gcd(a,b) = gcd(b, a%b).','Base case: gcd(a,0) = a.','Wrap this in a function.'],
HM059:['LCM(a,b) = (a*b) / GCD(a,b).','Compute GCD first, then divide product.','Result is always positive.'],
HM060:['Define power(b, e) = b^e using a loop.','Multiply b by itself e times.','Or use Math.pow() but implement your own.'],
HM061:['Read n, then n space-separated numbers.','Store them and print them back.','Use array/list.'],
HM062:['Same as HM061 — read and print the array.','Join with spaces when printing.','No extra spaces.'],
HM063:['Read array, sum all elements.','Initialize sum = 0, add each element.','Print the total.'],
HM064:['Sum the array, divide by n.','Print to 2 decimal places.','Use float division.'],
HM065:['Loop through array tracking the maximum.','Initialize max = first element.','Update when a larger element is found.'],
HM066:['Same as maximum but track minimum.','Initialize min = first element.','Update when a smaller element is found.'],
HM067:['Sort the array descending, take index 1.','Or find max, remove it, find max again.','Assume all elements are distinct.'],
HM068:['Reverse the order of elements.','Use [::-1] in Python or two-pointer.','Print space-separated.'],
HM069:['Loop through array, compare each element with target.','Return index (0-based) if found, -1 if not.','Print the index.'],
HM070:['Count elements where n%2==0 (even) and n%2!=0 (odd).','Print "evenCount oddCount".','Two separate counters.'],
HM071:['Count characters in the string.','Use len() in Python or .length() in Java.','No extra spaces in input.'],
HM072:['Reverse the string character by character.','Use [::-1] or StringBuilder.reverse().','Print the result.'],
HM073:['Compare string with its reverse.','If equal, it\'s a palindrome.','Case-sensitive.'],
HM074:['Count a, e, i, o, u (both cases).','Convert to lowercase first.','Print the count.'],
HM075:['Split the string by spaces, count the parts.','Use .split() in Python.','Handle multiple spaces.'],
HM076:['For each character: if uppercase → lowercase, if lowercase → uppercase.','Use isupper()/islower().','Digits and symbols stay unchanged.'],
HM077:['Remove all whitespace characters.','Use .replace(" ", "") or regex.','Print with no spaces.'],
HM078:['Count frequency of each character.','Use a dictionary/map.','Sort by character alphabetically and print char:count.'],
HM079:['Compare two strings using ==.','Case-sensitive comparison.','Print "Equal" or "Not Equal".'],
HM080:['Sort both strings and compare.','If sorted versions match, they are anagrams.','Ignore case.'],
HM081:['Bubble sort: compare adjacent pairs, swap if out of order.','Repeat n-1 times.','After each pass, largest bubbles to end.'],
HM082:['Selection sort: find minimum in unsorted part, swap to front.','O(n²) complexity.','Stable sort not required.'],
HM083:['Insertion sort: take one element, insert in correct position.','Like sorting playing cards.','Shift elements right to make room.'],
HM084:['Binary search on sorted array: check middle element.','If target < mid: search left half, else right half.','Return -1 if not found.'],
HM085:['Merge two arrays and sort the result.','Concatenate, then sort.','Print space-separated.'],
HM086:['Remove duplicate elements, keep first occurrence.','Use a set to track seen elements.','Maintain original order.'],
HM087:['Count how many times each element appears.','Use a dictionary/map.','Print "element:count" for each unique element.'],
HM088:['Given numbers 1..n with one missing, find which one.','Expected sum = n*(n+1)/2.','Missing = expected - actual sum.'],
HM089:['Rotate array left by k positions.','New array: arr[k..n] + arr[0..k-1].','Handle k > n using k % n.'],
HM090:['Prefix sum[i] = sum of arr[0..i].','Compute iteratively, adding as you go.','Print all prefix sums space-separated.'],
HM091:['Divide by 2 repeatedly, collect remainders.','Remainders read bottom-up give binary.','Or use bin() in Python.'],
HM092:['Binary to decimal: multiply each bit by 2^position.','Rightmost bit is position 0.','Or use int(binary, 2) in Python.'],
HM093:['GCD (Greatest Common Divisor) using Euclidean algorithm.','gcd(a,b) = gcd(b, a%b) until b=0.','Result is always positive.'],
HM094:['LCM = (a*b) / GCD(a,b).','Compute GCD first.','Watch for overflow in C/Java with large numbers.'],
HM095:['Sum all divisors of n excluding n itself.','If sum equals n, it\'s perfect (e.g., 6 = 1+2+3).','Only check up to n-1.'],
HM096:['Strong number: sum of factorial of digits equals the number.','145 = 1! + 4! + 5! = 145 ✓.','Precompute factorials 0–9.'],
HM097:['Automorphic: square of n ends with n.','5² = 25, ends in 5 → automorphic.','Use string endsWith() comparison.'],
HM098:['Neon number: sum of digits of its square equals itself.','9² = 81, 8+1 = 9 → neon.','Only 1 and 9 are neon numbers.'],
HM099:['Spy number: sum of digits equals product of digits.','123: 1+2+3=6, 1×2×3=6 → spy.','Both sum and product must be equal.'],
HM100:['Read n students with name and marks.','Sort by marks in descending order.','Print each student on a new line.'],
};

// ─── DESCRIPTIONS ────────────────────────────────────────────────────────────
const DESCRIPTIONS = {
HM001:{description:'Write a program that prints the text "Hello World" to the output.',inputFormat:'No input required.',outputFormat:'Print Hello World on a single line.',constraints:[],examples:[{input:'',output:'Hello World'}]},
HM002:{description:'Read a name from stdin and print it.',inputFormat:'A single string (the name).',outputFormat:'Print the name as-is.',constraints:['Name contains only letters'],examples:[{input:'Alice',output:'Alice'}]},
HM003:{description:'Print exactly three lines: Line 1, Line 2, Line 3.',inputFormat:'No input required.',outputFormat:'Three lines of text.',constraints:[],examples:[{input:'',output:'Line 1\nLine 2\nLine 3'}]},
HM004:{description:'Read an integer from stdin and print it back.',inputFormat:'A single integer.',outputFormat:'Print the integer.',constraints:['1 ≤ n ≤ 10^9'],examples:[{input:'42',output:'42'}]},
HM005:{description:'Read a word/string from stdin and print it.',inputFormat:'A single word.',outputFormat:'Print the word.',constraints:['Word length ≤ 100'],examples:[{input:'Hello',output:'Hello'}]},
HM006:{description:'Read two integers and print their sum.',inputFormat:'Two space-separated integers a and b.',outputFormat:'Print the sum a+b.',constraints:['1 ≤ a,b ≤ 10^9'],examples:[{input:'3 5',output:'8'}]},
HM007:{description:'Read two integers and print their difference.',inputFormat:'Two space-separated integers a and b.',outputFormat:'Print a-b.',constraints:['1 ≤ a,b ≤ 10^9'],examples:[{input:'10 3',output:'7'}]},
HM008:{description:'Read two integers and print their product.',inputFormat:'Two space-separated integers a and b.',outputFormat:'Print a*b.',constraints:['1 ≤ a,b ≤ 10^4'],examples:[{input:'4 6',output:'24'}]},
HM009:{description:'Read two integers and print the integer quotient of a divided by b.',inputFormat:'Two space-separated integers a and b.',outputFormat:'Print floor(a/b).',constraints:['1 ≤ b ≤ a ≤ 10^9'],examples:[{input:'10 3',output:'3'}]},
HM010:{description:'Read two integers and print the remainder of a divided by b.',inputFormat:'Two space-separated integers a and b.',outputFormat:'Print a % b.',constraints:['1 ≤ b ≤ a ≤ 10^9'],examples:[{input:'10 3',output:'1'}]},
HM011:{description:'Read two integers a and b, and print them in swapped order (b then a).',inputFormat:'Two space-separated integers a and b.',outputFormat:'Print b a (space-separated).',constraints:['1 ≤ a,b ≤ 10^9'],examples:[{input:'5 10',output:'10 5'}]},
HM012:{description:'Read length and width of a rectangle and print its area.',inputFormat:'Two space-separated integers l and w.',outputFormat:'Print the area.',constraints:['1 ≤ l,w ≤ 10^4'],examples:[{input:'5 3',output:'15'}]},
HM013:{description:'Read the radius of a circle and print its area to 2 decimal places.',inputFormat:'A single integer r.',outputFormat:'Print area with 2 decimal places.',constraints:['1 ≤ r ≤ 1000'],examples:[{input:'7',output:'153.94'}]},
HM014:{description:'Convert Celsius to Fahrenheit. F = (C × 9/5) + 32.',inputFormat:'A single number C.',outputFormat:'Print F to 2 decimal places.',constraints:['-273 ≤ C ≤ 10^6'],examples:[{input:'100',output:'212.00'}]},
HM015:{description:'Convert Fahrenheit to Celsius. C = (F - 32) × 5/9.',inputFormat:'A single number F.',outputFormat:'Print C to 2 decimal places.',constraints:['-500 ≤ F ≤ 10^6'],examples:[{input:'32',output:'0.00'}]},
HM016:{description:'Read three numbers and print their average to 2 decimal places.',inputFormat:'Three space-separated numbers.',outputFormat:'Print average to 2 decimal places.',constraints:['1 ≤ a,b,c ≤ 10^6'],examples:[{input:'10 20 30',output:'20.00'}]},
HM017:{description:'Read an integer n and print its square and cube separated by a space.',inputFormat:'A single integer n.',outputFormat:'Print n*n n*n*n.',constraints:['1 ≤ n ≤ 100'],examples:[{input:'4',output:'16 64'}]},
HM018:{description:'Read a single character and print its ASCII value.',inputFormat:'A single character.',outputFormat:'Print the ASCII code.',constraints:['Printable ASCII character'],examples:[{input:'A',output:'65'}]},
HM019:{description:'Read an integer n. Print n+1 and n-1 space-separated.',inputFormat:'A single integer n.',outputFormat:'Print (n+1) (n-1).',constraints:['1 ≤ n ≤ 10^9'],examples:[{input:'5',output:'6 4'}]},
HM020:{description:'Read two numbers and an operator (+, -, *, /). Print the result. Use integer division.',inputFormat:'Two integers and operator: a op b.',outputFormat:'Print the result or "Error" for division by zero.',constraints:['1 ≤ a,b ≤ 1000'],examples:[{input:'10 + 5',output:'15'},{input:'10 / 2',output:'5'}]},
HM021:{description:'Read an integer and determine if it is Even or Odd.',inputFormat:'A single integer.',outputFormat:'Print "Even" or "Odd".',constraints:['-10^9 ≤ n ≤ 10^9'],examples:[{input:'4',output:'Even'},{input:'7',output:'Odd'}]},
HM022:{description:'Read an integer and determine if it is Positive, Negative, or Zero.',inputFormat:'A single integer.',outputFormat:'Print "Positive", "Negative", or "Zero".',constraints:['-10^9 ≤ n ≤ 10^9'],examples:[{input:'5',output:'Positive'},{input:'-3',output:'Negative'},{input:'0',output:'Zero'}]},
HM023:{description:'Read two integers and print the larger one.',inputFormat:'Two space-separated integers a and b.',outputFormat:'Print max(a,b).',constraints:['-10^9 ≤ a,b ≤ 10^9'],examples:[{input:'10 20',output:'20'}]},
HM024:{description:'Read three integers and print the largest.',inputFormat:'Three space-separated integers.',outputFormat:'Print the maximum value.',constraints:['-10^9 ≤ a,b,c ≤ 10^9'],examples:[{input:'10 30 20',output:'30'}]},
HM025:{description:'Determine if a given year is a leap year.\nA year is a leap year if: divisible by 4 AND (not divisible by 100 OR divisible by 400).',inputFormat:'A single integer year.',outputFormat:'Print "Leap Year" or "Not a Leap Year".',constraints:['1 ≤ year ≤ 9999'],examples:[{input:'2000',output:'Leap Year'},{input:'1900',output:'Not a Leap Year'},{input:'2024',output:'Leap Year'}]},
HM026:{description:'Read an age and determine if the person is eligible to vote (age >= 18).',inputFormat:'A single integer age.',outputFormat:'Print "Eligible" or "Not Eligible".',constraints:['1 ≤ age ≤ 150'],examples:[{input:'20',output:'Eligible'},{input:'15',output:'Not Eligible'}]},
HM027:{description:'Read a score (0–100) and print the corresponding grade.\n>=90: A, >=80: B, >=70: C, >=60: D, else: F.',inputFormat:'A single integer score.',outputFormat:'Print the grade letter.',constraints:['0 ≤ score ≤ 100'],examples:[{input:'95',output:'A'},{input:'75',output:'C'},{input:'55',output:'F'}]},
HM028:{description:'Read two numbers and an operator (+, -, *, /). Compute and print the result using switch-case logic.',inputFormat:'Two integers and operator.',outputFormat:'Print the result.',constraints:['1 ≤ a,b ≤ 1000'],examples:[{input:'6 * 7',output:'42'}]},
HM029:{description:'Read n and print all integers from 1 to n, space-separated.',inputFormat:'A single integer n.',outputFormat:'Space-separated integers from 1 to n.',constraints:['1 ≤ n ≤ 100'],examples:[{input:'5',output:'1 2 3 4 5'}]},
HM030:{description:'Read n and print all integers from n down to 1, space-separated.',inputFormat:'A single integer n.',outputFormat:'Space-separated integers from n to 1.',constraints:['1 ≤ n ≤ 100'],examples:[{input:'5',output:'5 4 3 2 1'}]},
HM031:{description:'Read n numbers and print their sum.',inputFormat:'First line: n. Second line: n space-separated integers.',outputFormat:'Print the sum.',constraints:['1 ≤ n ≤ 1000', '-10^6 ≤ each ≤ 10^6'],examples:[{input:'3\n1 2 3',output:'6'}]},
HM032:{description:'Read n and print n! (n factorial).',inputFormat:'A single integer n.',outputFormat:'Print n!.',constraints:['0 ≤ n ≤ 12'],examples:[{input:'5',output:'120'},{input:'0',output:'1'}]},
HM033:{description:'Read a number n and rows r, then print the multiplication table of n for 1 to r rows.\nFormat: "n x i = n*i".',inputFormat:'Two space-separated integers n and r.',outputFormat:'r lines of multiplication table.',constraints:['1 ≤ n ≤ 99', '1 ≤ r ≤ 10'],examples:[{input:'5 3',output:'5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15'}]},
HM034:{description:'Print the first n numbers of the Fibonacci series, space-separated.',inputFormat:'A single integer n.',outputFormat:'First n Fibonacci numbers space-separated.',constraints:['1 ≤ n ≤ 20'],examples:[{input:'6',output:'0 1 1 2 3 5'}]},
HM035:{description:'Determine if a number is prime.',inputFormat:'A single integer n.',outputFormat:'Print "Prime" or "Not Prime".',constraints:['1 ≤ n ≤ 10^6'],examples:[{input:'7',output:'Prime'},{input:'10',output:'Not Prime'}]},
HM036:{description:'An Armstrong number equals the sum of its digits each raised to the power of the number of digits.\nExample: 153 = 1³+5³+3³.',inputFormat:'A single integer.',outputFormat:'Print "Armstrong" or "Not Armstrong".',constraints:['1 ≤ n ≤ 10^6'],examples:[{input:'153',output:'Armstrong'},{input:'10',output:'Not Armstrong'}]},
HM037:{description:'A palindrome number reads the same forward and backward.\nExample: 121 is a palindrome.',inputFormat:'A single integer.',outputFormat:'Print "Palindrome" or "Not Palindrome".',constraints:['1 ≤ n ≤ 10^9'],examples:[{input:'121',output:'Palindrome'},{input:'123',output:'Not Palindrome'}]},
HM038:{description:'Reverse the digits of a number.',inputFormat:'A single integer n.',outputFormat:'Print the reversed number.',constraints:['1 ≤ n ≤ 10^9'],examples:[{input:'12345',output:'54321'},{input:'1000',output:'1'}]},
HM039:{description:'Count the number of digits in an integer.',inputFormat:'A single positive integer.',outputFormat:'Print the count.',constraints:['1 ≤ n ≤ 10^18'],examples:[{input:'12345',output:'5'}]},
HM040:{description:'Read an integer and print the sum of its digits.',inputFormat:'A single integer.',outputFormat:'Print the sum of digits.',constraints:['1 ≤ n ≤ 10^18'],examples:[{input:'123',output:'6'}]},
HM041:{description:'Print an n×n square pattern of stars.',inputFormat:'A single integer n.',outputFormat:'n rows, each with n stars.',constraints:['1 ≤ n ≤ 10'],examples:[{input:'3',output:'***\n***\n***'}]},
HM042:{description:'Print a right-angled triangle pattern of stars with n rows.\nRow i has i stars.',inputFormat:'A single integer n.',outputFormat:'n rows of stars.',constraints:['1 ≤ n ≤ 10'],examples:[{input:'3',output:'*\n**\n***'}]},
HM043:{description:'Print an inverted right triangle of stars.\nFirst row has n stars, last row has 1.',inputFormat:'A single integer n.',outputFormat:'n rows of stars, decreasing.',constraints:['1 ≤ n ≤ 10'],examples:[{input:'3',output:'***\n**\n*'}]},
HM044:{description:'Print a centered pyramid of stars with n rows.\nRow i has (2i-1) stars centered.',inputFormat:'A single integer n.',outputFormat:'n rows, each with leading spaces and stars.',constraints:['1 ≤ n ≤ 10'],examples:[{input:'3',output:'  *\n ***\n*****'}]},
HM045:{description:'Print an inverted pyramid (widest at top, narrowest at bottom).',inputFormat:'A single integer n.',outputFormat:'n rows of centered stars.',constraints:['1 ≤ n ≤ 10'],examples:[{input:'3',output:'*****\n ***\n  *'}]},
HM046:{description:'Print a diamond pattern (pyramid + inverted pyramid).',inputFormat:'A single integer n.',outputFormat:'(2n-1) rows of diamond.',constraints:['1 ≤ n ≤ 8'],examples:[{input:'3',output:'  *\n ***\n*****\n ***\n  *'}]},
HM047:{description:'Print a hollow square of stars (only border stars, inside is spaces).',inputFormat:'A single integer n.',outputFormat:'n rows of hollow square.',constraints:['2 ≤ n ≤ 10'],examples:[{input:'4',output:'****\n*  *\n*  *\n****'}]},
HM048:{description:'Print a number triangle where row i contains numbers 1 to i.',inputFormat:'A single integer n.',outputFormat:'n rows of numbers.',constraints:['1 ≤ n ≤ 10'],examples:[{input:'3',output:'1\n1 2\n1 2 3'}]},
HM049:{description:'Print Floyd\'s triangle: consecutive numbers arranged in a triangle.',inputFormat:'A single integer n (number of rows).',outputFormat:'n rows with consecutive numbers.',constraints:['1 ≤ n ≤ 10'],examples:[{input:'3',output:'1\n2 3\n4 5 6'}]},
HM050:{description:'Print Pascal\'s triangle with n rows.',inputFormat:'A single integer n.',outputFormat:'n rows of Pascal\'s triangle.',constraints:['1 ≤ n ≤ 10'],examples:[{input:'4',output:'1\n1 1\n1 2 1\n1 3 3 1'}]},
HM051:{description:'Write a function add(a, b) that returns the sum of two numbers. Read a and b, call the function, and print the result.',inputFormat:'Two space-separated integers.',outputFormat:'Print the sum.',constraints:['1 ≤ a,b ≤ 10^9'],examples:[{input:'3 4',output:'7'}]},
HM052:{description:'Write a function maximum(a, b) that returns the larger of two numbers.',inputFormat:'Two space-separated integers.',outputFormat:'Print the maximum.',constraints:['-10^9 ≤ a,b ≤ 10^9'],examples:[{input:'10 20',output:'20'}]},
HM053:{description:'Write a function factorial(n) that computes n! using a loop.',inputFormat:'A single integer n.',outputFormat:'Print n!.',constraints:['0 ≤ n ≤ 12'],examples:[{input:'6',output:'720'}]},
HM054:{description:'Write a function isPrime(n) that checks if n is prime.',inputFormat:'A single integer n.',outputFormat:'Print "Prime" or "Not Prime".',constraints:['1 ≤ n ≤ 10^6'],examples:[{input:'13',output:'Prime'}]},
HM055:{description:'Write a function fibonacci(n) that returns the first n Fibonacci numbers.',inputFormat:'A single integer n.',outputFormat:'First n Fibonacci numbers space-separated.',constraints:['1 ≤ n ≤ 20'],examples:[{input:'5',output:'0 1 1 2 3'}]},
HM056:{description:'Compute factorial of n using RECURSION.',inputFormat:'A single integer n.',outputFormat:'Print n!.',constraints:['0 ≤ n ≤ 12'],examples:[{input:'5',output:'120'}]},
HM057:{description:'Compute the first n Fibonacci numbers using RECURSION.',inputFormat:'A single integer n.',outputFormat:'First n Fibonacci numbers space-separated.',constraints:['1 ≤ n ≤ 10'],examples:[{input:'6',output:'0 1 1 2 3 5'}]},
HM058:{description:'Write a function gcd(a, b) to compute the Greatest Common Divisor using the Euclidean algorithm.',inputFormat:'Two space-separated integers a and b.',outputFormat:'Print GCD(a,b).',constraints:['1 ≤ a,b ≤ 10^9'],examples:[{input:'12 18',output:'6'}]},
HM059:{description:'Write a function lcm(a, b) to compute the Least Common Multiple.',inputFormat:'Two space-separated integers a and b.',outputFormat:'Print LCM(a,b).',constraints:['1 ≤ a,b ≤ 10^4'],examples:[{input:'4 6',output:'12'}]},
HM060:{description:'Write a function power(base, exp) that computes base^exp without using built-in power functions.',inputFormat:'Two space-separated integers base and exp.',outputFormat:'Print the result.',constraints:['1 ≤ base ≤ 100', '0 ≤ exp ≤ 10'],examples:[{input:'2 8',output:'256'}]},
HM061:{description:'Read n numbers into an array and print them.',inputFormat:'First line: n. Second line: n space-separated integers.',outputFormat:'Print the array elements space-separated.',constraints:['1 ≤ n ≤ 100'],examples:[{input:'4\n1 2 3 4',output:'1 2 3 4'}]},
HM062:{description:'Read an array and print all its elements space-separated.',inputFormat:'First line: n. Second line: n integers.',outputFormat:'Space-separated integers.',constraints:['1 ≤ n ≤ 100'],examples:[{input:'3\n5 10 15',output:'5 10 15'}]},
HM063:{description:'Read an array and print the sum of all elements.',inputFormat:'First line: n. Second line: n integers.',outputFormat:'Print the sum.',constraints:['1 ≤ n ≤ 1000'],examples:[{input:'4\n1 2 3 4',output:'10'}]},
HM064:{description:'Read an array and print the average to 2 decimal places.',inputFormat:'First line: n. Second line: n integers.',outputFormat:'Print average with 2 decimal places.',constraints:['1 ≤ n ≤ 1000'],examples:[{input:'4\n10 20 30 40',output:'25.00'}]},
HM065:{description:'Read an array and find the maximum element.',inputFormat:'First line: n. Second line: n integers.',outputFormat:'Print the maximum.',constraints:['1 ≤ n ≤ 1000'],examples:[{input:'5\n3 1 4 1 5',output:'5'}]},
HM066:{description:'Read an array and find the minimum element.',inputFormat:'First line: n. Second line: n integers.',outputFormat:'Print the minimum.',constraints:['1 ≤ n ≤ 1000'],examples:[{input:'5\n3 1 4 1 5',output:'1'}]},
HM067:{description:'Find the second largest unique element in an array.',inputFormat:'First line: n. Second line: n integers (all distinct).',outputFormat:'Print the second largest.',constraints:['2 ≤ n ≤ 100', 'All elements are distinct'],examples:[{input:'5\n1 3 5 2 4',output:'4'}]},
HM068:{description:'Read an array and print its elements in reverse order.',inputFormat:'First line: n. Second line: n integers.',outputFormat:'Space-separated integers in reverse.',constraints:['1 ≤ n ≤ 100'],examples:[{input:'4\n1 2 3 4',output:'4 3 2 1'}]},
HM069:{description:'Perform linear search: find the 0-based index of a target in the array, or -1 if not found.',inputFormat:'First line: n. Second line: n integers. Third line: target.',outputFormat:'Print the index (0-based) or -1.',constraints:['1 ≤ n ≤ 1000'],examples:[{input:'5\n10 20 30 40 50\n30',output:'2'},{input:'5\n10 20 30 40 50\n99',output:'-1'}]},
HM070:{description:'Count how many elements in the array are even and how many are odd.',inputFormat:'First line: n. Second line: n integers.',outputFormat:'Print "evenCount oddCount".',constraints:['1 ≤ n ≤ 1000'],examples:[{input:'6\n1 2 3 4 5 6',output:'3 3'}]},
HM071:{description:'Read a string and print its length.',inputFormat:'A single string (no spaces).',outputFormat:'Print the length.',constraints:['1 ≤ length ≤ 1000'],examples:[{input:'hello',output:'5'}]},
HM072:{description:'Read a string and print it in reverse.',inputFormat:'A single string.',outputFormat:'Print the reversed string.',constraints:['1 ≤ length ≤ 1000'],examples:[{input:'hello',output:'olleh'}]},
HM073:{description:'Check if a string is a palindrome (reads same forwards and backwards).',inputFormat:'A single string.',outputFormat:'Print "Palindrome" or "Not Palindrome".',constraints:['1 ≤ length ≤ 1000'],examples:[{input:'racecar',output:'Palindrome'},{input:'hello',output:'Not Palindrome'}]},
HM074:{description:'Count the number of vowels (a,e,i,o,u) in a string (case-insensitive).',inputFormat:'A single string.',outputFormat:'Print the count.',constraints:['1 ≤ length ≤ 1000'],examples:[{input:'hello',output:'2'}]},
HM075:{description:'Count the number of words in a sentence.',inputFormat:'A sentence (may have multiple spaces).',outputFormat:'Print the word count.',constraints:['1 ≤ words ≤ 1000'],examples:[{input:'hello world',output:'2'}]},
HM076:{description:'Toggle the case of each character: uppercase → lowercase, lowercase → uppercase.',inputFormat:'A string.',outputFormat:'Print the toggled string.',constraints:['Length ≤ 1000'],examples:[{input:'Hello World',output:'hELLO wORLD'}]},
HM077:{description:'Remove all spaces from a string.',inputFormat:'A string with spaces.',outputFormat:'Print the string without spaces.',constraints:['Length ≤ 1000'],examples:[{input:'h e l l o',output:'hello'}]},
HM078:{description:'Count the frequency of each character in a string.\nPrint each character and its count alphabetically sorted.',inputFormat:'A single string (lowercase letters only).',outputFormat:'Each line: "char:count" sorted alphabetically.',constraints:['Length ≤ 1000'],examples:[{input:'aab',output:'a:2\nb:1'}]},
HM079:{description:'Read two strings and check if they are equal.',inputFormat:'Two strings on separate lines.',outputFormat:'Print "Equal" or "Not Equal".',constraints:['Length ≤ 1000'],examples:[{input:'hello\nhello',output:'Equal'},{input:'hello\nworld',output:'Not Equal'}]},
HM080:{description:'Check if two strings are anagrams of each other.\nAnagrams contain the same characters with the same frequency.',inputFormat:'Two strings on separate lines.',outputFormat:'Print "Anagram" or "Not Anagram".',constraints:['Length ≤ 1000'],examples:[{input:'listen\nsilent',output:'Anagram'},{input:'hello\nworld',output:'Not Anagram'}]},
HM081:{description:'Implement Bubble Sort to sort an array in ascending order.',inputFormat:'First line: n. Second line: n integers.',outputFormat:'Sorted integers space-separated.',constraints:['1 ≤ n ≤ 100'],examples:[{input:'5\n64 34 25 12 22',output:'12 22 25 34 64'}]},
HM082:{description:'Implement Selection Sort to sort an array in ascending order.',inputFormat:'First line: n. Second line: n integers.',outputFormat:'Sorted integers space-separated.',constraints:['1 ≤ n ≤ 100'],examples:[{input:'5\n64 25 12 22 11',output:'11 12 22 25 64'}]},
HM083:{description:'Implement Insertion Sort to sort an array in ascending order.',inputFormat:'First line: n. Second line: n integers.',outputFormat:'Sorted integers space-separated.',constraints:['1 ≤ n ≤ 100'],examples:[{input:'5\n12 11 13 5 6',output:'5 6 11 12 13'}]},
HM084:{description:'Implement Binary Search to find a target in a sorted array.\nReturn 0-based index, or -1 if not found.',inputFormat:'First line: n. Second line: n sorted integers. Third line: target.',outputFormat:'Print the index or -1.',constraints:['1 ≤ n ≤ 10^5'],examples:[{input:'5\n1 3 5 7 9\n5',output:'2'},{input:'5\n1 3 5 7 9\n6',output:'-1'}]},
HM085:{description:'Merge two arrays and print all elements sorted in ascending order.',inputFormat:'First line: n1. Second line: n1 integers. Third line: n2. Fourth line: n2 integers.',outputFormat:'Sorted merged array space-separated.',constraints:['1 ≤ n1,n2 ≤ 100'],examples:[{input:'3\n1 3 5\n3\n2 4 6',output:'1 2 3 4 5 6'}]},
HM086:{description:'Remove duplicate elements from an array, keeping only the first occurrence of each.',inputFormat:'First line: n. Second line: n integers.',outputFormat:'Unique elements in original order, space-separated.',constraints:['1 ≤ n ≤ 1000'],examples:[{input:'6\n1 2 2 3 3 4',output:'1 2 3 4'}]},
HM087:{description:'Find the frequency (count) of each element in the array.',inputFormat:'First line: n. Second line: n integers.',outputFormat:'Each line: "element:count" for each unique element.',constraints:['1 ≤ n ≤ 1000'],examples:[{input:'5\n1 2 1 3 2',output:'1:2\n2:2\n3:1'}]},
HM088:{description:'Given an array of n-1 distinct numbers from 1 to n, find the missing number.\nThe expected sum of 1..n is n*(n+1)/2.',inputFormat:'First line: n. Second line: (n-1) integers.',outputFormat:'Print the missing number.',constraints:['2 ≤ n ≤ 10^5'],examples:[{input:'5\n1 2 4 5',output:'3'}]},
HM089:{description:'Rotate an array to the left by k positions.\nExample: [1,2,3,4,5] rotated left by 2 → [3,4,5,1,2].',inputFormat:'First line: n. Second line: n integers. Third line: k.',outputFormat:'Rotated array space-separated.',constraints:['1 ≤ n ≤ 1000', '0 ≤ k < n'],examples:[{input:'5\n1 2 3 4 5\n2',output:'3 4 5 1 2'}]},
HM090:{description:'Compute the prefix sum array.\nprefix[i] = arr[0] + arr[1] + ... + arr[i].',inputFormat:'First line: n. Second line: n integers.',outputFormat:'Prefix sums space-separated.',constraints:['1 ≤ n ≤ 1000'],examples:[{input:'4\n1 2 3 4',output:'1 3 6 10'}]},
HM091:{description:'Convert a decimal (base-10) integer to binary (base-2).',inputFormat:'A single non-negative integer.',outputFormat:'Print the binary representation.',constraints:['0 ≤ n ≤ 10^9'],examples:[{input:'10',output:'1010'}]},
HM092:{description:'Convert a binary string to its decimal (base-10) equivalent.',inputFormat:'A binary string (only 0s and 1s).',outputFormat:'Print the decimal value.',constraints:['Binary string length ≤ 32'],examples:[{input:'1010',output:'10'}]},
HM093:{description:'Find the GCD (Greatest Common Divisor) of two numbers using the Euclidean algorithm.',inputFormat:'Two space-separated integers a and b.',outputFormat:'Print GCD(a,b).',constraints:['1 ≤ a,b ≤ 10^9'],examples:[{input:'48 18',output:'6'}]},
HM094:{description:'Find the LCM (Least Common Multiple) of two numbers.',inputFormat:'Two space-separated integers a and b.',outputFormat:'Print LCM(a,b).',constraints:['1 ≤ a,b ≤ 10^4'],examples:[{input:'4 6',output:'12'}]},
HM095:{description:'A perfect number equals the sum of its proper divisors (excluding itself).\nExample: 6 = 1+2+3.',inputFormat:'A single integer n.',outputFormat:'Print "Perfect" or "Not Perfect".',constraints:['1 ≤ n ≤ 10^5'],examples:[{input:'6',output:'Perfect'},{input:'12',output:'Not Perfect'}]},
HM096:{description:'A strong number equals the sum of the factorials of its digits.\nExample: 145 = 1! + 4! + 5! = 1 + 24 + 120 = 145.',inputFormat:'A single integer.',outputFormat:'Print "Strong" or "Not Strong".',constraints:['1 ≤ n ≤ 10^6'],examples:[{input:'145',output:'Strong'},{input:'100',output:'Not Strong'}]},
HM097:{description:'An automorphic number is one whose square ends with the number itself.\nExample: 5² = 25 → ends with 5 → automorphic.',inputFormat:'A single integer.',outputFormat:'Print "Automorphic" or "Not Automorphic".',constraints:['1 ≤ n ≤ 10^6'],examples:[{input:'5',output:'Automorphic'},{input:'3',output:'Not Automorphic'}]},
HM098:{description:'A neon number is one where the sum of digits of its square equals itself.\nExample: 9² = 81 → 8+1 = 9 → neon.',inputFormat:'A single integer.',outputFormat:'Print "Neon" or "Not Neon".',constraints:['1 ≤ n ≤ 1000'],examples:[{input:'9',output:'Neon'},{input:'2',output:'Not Neon'}]},
HM099:{description:'A spy number is one where sum of digits equals product of digits.\nExample: 123 → 1+2+3=6, 1×2×3=6 → spy.',inputFormat:'A single integer.',outputFormat:'Print "Spy" or "Not Spy".',constraints:['1 ≤ n ≤ 10000'],examples:[{input:'123',output:'Spy'},{input:'100',output:'Not Spy'}]},
HM100:{description:'Read n students (name and marks). Sort them by marks in descending order and print each student\'s name and marks.',inputFormat:'First line: n. Each following line: name marks.',outputFormat:'Students sorted by marks (desc), one per line: "name marks".',constraints:['1 ≤ n ≤ 100', '0 ≤ marks ≤ 100'],examples:[{input:'3\nAlice 85\nBob 90\nCharlie 78',output:'Bob 90\nAlice 85\nCharlie 78'}]},
};

// ─── Generate all files ───────────────────────────────────────────────────────
console.log('\n🚀 Generating HeyMine AI Labs data files...\n');

let totalFiles = 0;

for (const q of QUESTIONS) {
  const id = q.id;
  const num = parseInt(id.replace('HM',''));

  // ── 1. Question metadata ──
  const prevId = q.mission > 1 ? `HM${String(q.mission-1).padStart(3,'0')}` : null;
  const nextId = q.mission < 100 ? `HM${String(q.mission+1).padStart(3,'0')}` : null;
  const desc = DESCRIPTIONS[id] || {};
  const meta = {
    id, title: q.title, stage: q.stage,
    stageName: STAGE_NAMES[q.stage],
    mission: q.mission, difficulty: q.difficulty,
    xp: q.xp, coins: q.coins,
    nodeType: q.boss ? 'boss' : 'normal',
    estimatedMinutes: q.stage <= 2 ? 10 : 20,
    unlockAfter: prevId,
    unlockNext: nextId,
    description: desc.description || q.title,
    inputFormat: desc.inputFormat || 'Read from stdin.',
    outputFormat: desc.outputFormat || 'Write to stdout.',
    constraints: desc.constraints || [],
    examples: desc.examples || [],
    tags: [],
  };
  write(path.join(ROOT,'data','questions',`${id}.json`), meta);
  totalFiles++;

  // ── 2. Generate 10 test cases using seeds ──
  const gen = GENERATORS[id];
  if (!gen) { console.warn(`  ⚠ No generator for ${id}`); continue; }

  const visibleTests = [];
  const hiddenTests = [];

  // Seeds 1-5 → visible, seeds 101-105 → hidden (deterministic separation)
  for (let s = 1; s <= 5; s++) {
    try {
      const tc = gen(s * 7919 + num); // prime-based seed variation
      visibleTests.push({ input: tc.input, expected: tc.expected });
    } catch(e) {
      console.warn(`  ⚠ ${id} visible seed ${s}:`, e.message);
    }
  }
  for (let s = 6; s <= 10; s++) {
    try {
      const tc = gen(s * 7919 + num + 99991); // different seed space for hidden
      hiddenTests.push({ input: tc.input, expected: tc.expected });
    } catch(e) {
      console.warn(`  ⚠ ${id} hidden seed ${s}:`, e.message);
    }
  }

  write(path.join(ROOT,'data','visible-tests',`${id}.json`), visibleTests);
  write(path.join(ROOT,'data','hidden-tests',`${id}.json`), hiddenTests);
  totalFiles += 2;

  // ── 3. Hints ──
  const hints = HINTS_DB[id] || ['Think carefully about the problem.','Break it into smaller steps.','Test with the examples.'];
  write(path.join(ROOT,'data','hints',`${id}.json`), { id, hints });
  totalFiles++;
}

// ── 4. Write generators JS (module with all generators) ──
const genExports = QUESTIONS.map(q => {
  const id = q.id;
  const gen = GENERATORS[id];
  if (!gen) return `// ${id}: no generator`;
  return `// ${id}: ${q.title}\nmodule.exports['${id}'] = ${gen.toString()};`;
}).join('\n\n');

write(path.join(ROOT,'data','generators','index.js'), `/**
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

${Object.entries(GENERATORS).map(([id, fn]) =>
  `// ${id}\nmodule.exports['${id}'] = ${fn.toString()};`
).join('\n\n')}
`);
totalFiles++;

// ── 5. Write reference solutions JS ──
write(path.join(ROOT,'data','reference-solutions','index.js'), `/**
 * reference-solutions/index.js
 * Server-side reference solutions for all 100 missions.
 * Each solve(input: string): string function returns the correct output.
 * NEVER expose this file to the frontend.
 */
module.exports = {};

${Object.entries(SOLUTIONS).map(([id, fn]) =>
  `// ${id}\nmodule.exports['${id}'] = ${fn.toString()};`
).join('\n\n')}
`);
totalFiles++;

// ── 6. Initial progress.json ──
const progressPath = path.join(ROOT,'storage','progress.json');
if (!fs.existsSync(progressPath)) {
  write(progressPath, {
    currentMission: 'HM001',
    currentStage: 1,
    currentLanguage: 'python',
    xp: 0,
    coins: 0,
    badges: [],
    completedMissions: [],
    unlockedMissions: ['HM001'],
    streak: { current: 0, longest: 0, lastDate: null },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  totalFiles++;
}

console.log(`\n✅ Done! Generated ${totalFiles} files.\n`);
