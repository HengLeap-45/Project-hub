const projects=[
 {title:"E-commerce Platform",description:"Modern e-commerce with real-time updates",image:"./assets/project_ecommerce.jpg",category:"web",technologies:["React","Node.js"],author:"Alex Johnson"},
 {title:"AI Chat Assistant",description:"Advanced conversational AI",image:"./assets/project_ai.jpg",category:"python",technologies:["Python","TensorFlow"],author:"Sarah Chen"},
 {title:"Design System",description:"Complete UI component library",image:"./assets/project_design.jpg",category:"web",technologies:["Figma","CSS"],author:"Marcus Design"},
 {title:"Mobile App",description:"Cross-platform fitness tracker",image:"./assets/project_thumbnail.jpg",category:"javascript",technologies:["React Native","Firebase"],author:"Emma Davis"},
 {title:"Data Analytics",description:"Visualization and analytics tool",image:"./assets/project_thumbnail.jpg",category:"python",technologies:["Python","Pandas"],author:"James Wilson"},
 {title:"API Server",description:"RESTful API with authentication",image:"./assets/project_thumbnail.jpg",category:"web",technologies:["Node.js","MongoDB"],author:"Lisa Anderson"},
];
const tagColors=['bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300','bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300','bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300','bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'];

function renderProjects(filter,search){
  const c=document.getElementById('projects-container');
  if(!c) return;
  let f=projects.filter(p=>filter==='all'||p.category===filter);
  if(search) f=f.filter(p=>p.title.toLowerCase().includes(search.toLowerCase()));
  c.innerHTML=f.map((p,i)=>`
    <div class="rounded-2xl overflow-hidden bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
      <div class="h-44 flex items-center justify-center overflow-hidden"><img src="${p.image}" alt="${p.title}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"></div>
      <div class="p-6">
        <h3 class="text-lg font-bold mb-1">${p.title}</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">${p.description}</p>
        <div class="flex gap-2 mb-4 flex-wrap">${p.technologies.map((t,j)=>`<span class="px-2.5 py-1 rounded-lg text-xs font-bold ${tagColors[(i+j)%tagColors.length]}">${t}</span>`).join('')}</div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-slate-500">${p.author}</span>
          <button class="px-4 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-fuchsia-500 to-blue-600">View</button>
        </div>
      </div>
    </div>`).join('');
}
renderProjects('all','');

document.querySelectorAll('.category-filter').forEach(btn=>{
  btn.addEventListener('click',e=>{
    document.querySelectorAll('.category-filter').forEach(b=>{
      b.className='category-filter px-4 py-2 rounded-full text-sm font-bold border border-slate-200 dark:border-slate-700 hover:border-violet-400';
    });
    e.currentTarget.className='category-filter px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-fuchsia-500 to-blue-600';
    renderProjects(e.currentTarget.dataset.category,document.getElementById('project-search').value);
  });
});
const projSearch = document.getElementById('project-search');
if(projSearch) {
  projSearch.addEventListener('input',e=>{
    const active=[...document.querySelectorAll('.category-filter')].find(b=>b.className.includes('text-white'));
    renderProjects(active?.dataset.category||'all',e.target.value);
  });
}

const navbarSearch = document.getElementById('navbar-search');
if (navbarSearch) {
  navbarSearch.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      const val = e.target.value;
      const onHomePage = document.getElementById('projects') !== null;
      if (onHomePage) {
        scrollToSection('projects');
        if (projSearch) {
          projSearch.value = val;
          projSearch.dispatchEvent(new Event('input'));
        }
      } else {
        window.location.href = `modern-website.html#projects?search=${encodeURIComponent(val)}`;
      }
    }
  });
}

/* navbar shell on scroll */
const navShell=document.getElementById('navShell');
function updateNavShell(){
  if(window.scrollY>40){
    navShell.className='mx-3 mt-3 sm:mx-6 sm:mt-4 rounded-2xl transition-all duration-300 border border-slate-200/70 dark:border-white/10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-lg shadow-slate-900/5';
  } else {
    navShell.className='mx-3 mt-3 sm:mx-6 sm:mt-4 rounded-2xl transition-all duration-300 border border-transparent';
  }
}
window.addEventListener('scroll',updateNavShell); updateNavShell();

/* sliding pill indicator */
const indicator=document.getElementById('navIndicator');
const pills=[...document.querySelectorAll('.nav-pill')];
function moveIndicator(el){
  if(!el) return;
  indicator.style.left=el.offsetLeft+'px';
  indicator.style.width=el.offsetWidth+'px';
  pills.forEach(p=>p.classList.remove('text-white'));
  el.classList.add('text-white');
}
function setActive(target){
  const el=pills.find(p=>p.dataset.target===target);
  moveIndicator(el);
}
setTimeout(()=>setActive('home'),80);
window.addEventListener('resize',()=>{
  const active=pills.find(p=>p.classList.contains('text-white'));
  moveIndicator(active);
});
window.addEventListener('scroll',()=>{
  let current='home';
  document.querySelectorAll('section[id]').forEach(sec=>{ if(window.scrollY>=sec.offsetTop-220) current=sec.id; });
  if(pills.some(p=>p.dataset.target===current)) setActive(current);
});

/* dropdown panels */
function togglePanel(id){
  const panel=document.getElementById(id);
  const open=!panel.classList.contains('hidden');
  document.querySelectorAll('#notifPanel,#profilePanel').forEach(p=>p.classList.add('hidden'));
  if(!open) panel.classList.remove('hidden');
}
document.addEventListener('click',e=>{
  if(!e.target.closest('#notifPanel') && !e.target.closest('#profileTrigger') && !e.target.closest('[onclick*="togglePanel"]')){
    document.querySelectorAll('#notifPanel,#profilePanel').forEach(p=>p.classList.add('hidden'));
  }
});

/* mobile menu */
const hamburgerBtn=document.getElementById('hamburgerBtn');
const mobileMenu=document.getElementById('mobileMenu');
hamburgerBtn.addEventListener('click',()=>{
  mobileMenu.classList.toggle('translate-x-full');
  const bars=hamburgerBtn.querySelectorAll('span');
  const active=!mobileMenu.classList.contains('translate-x-full');
  bars[0].style.transform=active?'translateY(7px) rotate(45deg)':'';
  bars[1].style.opacity=active?'0':'1';
  bars[2].style.transform=active?'translateY(-7px) rotate(-45deg)':'';
});
document.getElementById('mobileClose').addEventListener('click',()=>hamburgerBtn.click());
document.querySelectorAll('.mobile-link').forEach(l=>l.addEventListener('click',()=>hamburgerBtn.click()));

/* theme */
function toggleTheme(){
  document.documentElement.classList.toggle('dark');
  const dark=document.documentElement.classList.contains('dark');
  localStorage.setItem('theme',dark?'dark':'light');
  document.getElementById('iconSun').style.opacity=dark?'0':'1';
  document.getElementById('iconSun').style.transform=dark?'rotate(-90deg) scale(.5)':'rotate(0) scale(1)';
  document.getElementById('iconMoon').style.opacity=dark?'1':'0';
  document.getElementById('iconMoon').style.transform=dark?'rotate(0) scale(1)':'rotate(90deg) scale(.5)';
}
if(localStorage.getItem('theme')==='dark'){document.documentElement.classList.add('dark');document.getElementById('iconSun').style.opacity='0';document.getElementById('iconMoon').style.opacity='1';document.getElementById('iconMoon').style.transform='rotate(0) scale(1)';}

/* auth modal */
function openAuthModal(mode){
  const modal=document.getElementById('authModal');
  document.getElementById('modalTitle').textContent=mode==='signup'?'Create Account':'Login';
  document.getElementById('signupName').classList.toggle('hidden',mode!=='signup');
  document.getElementById('modalToggleText').textContent=mode==='login'?"Don't have an account?":'Already have an account?';
  document.getElementById('modalToggleLink').textContent=mode==='login'?'Sign up':'Login';
  modal.dataset.mode=mode;
  modal.classList.remove('hidden'); modal.classList.add('flex');
}
function closeAuthModal(){ const m=document.getElementById('authModal'); m.classList.add('hidden'); m.classList.remove('flex'); }
function toggleAuthMode(){ openAuthModal(document.getElementById('authModal').dataset.mode==='login'?'signup':'login'); }
function checkAuthState() {
  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  const loginBtns = document.querySelectorAll('#loginBtn');
  const profileTriggers = document.querySelectorAll('#profileTrigger');
  
  if (loggedIn) {
    loginBtns.forEach(b => b.classList.add('hidden'));
    profileTriggers.forEach(t => t.classList.remove('hidden'));
  } else {
    loginBtns.forEach(b => b.classList.remove('hidden'));
    profileTriggers.forEach(t => t.classList.add('hidden'));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  checkAuthState();
  
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
  if (urlParams.has('search')) {
    const s = urlParams.get('search');
    const projSearch = document.getElementById('project-search');
    if (projSearch) {
      projSearch.value = s;
      projSearch.dispatchEvent(new Event('input'));
      setTimeout(() => scrollToSection('projects'), 100);
    }
  }
});

function handleAuth(e){
  e.preventDefault(); closeAuthModal();
  localStorage.setItem('loggedIn', 'true');
  checkAuthState();
  showToast('Successfully logged in!');
}
function logout(){
  localStorage.removeItem('loggedIn');
  checkAuthState();
  document.querySelectorAll('#notifPanel,#profilePanel').forEach(p=>p.classList.add('hidden'));
  showToast('Logged out successfully!');
}
function showToast(msg){
  const t=document.getElementById('toast');
  document.getElementById('toastMessage').textContent=msg;
  t.classList.remove('opacity-0','invisible','translate-y-2');
  setTimeout(()=>t.classList.add('opacity-0','invisible','translate-y-2'),3000);
}
function scrollToSection(id){document.getElementById(id).scrollIntoView({behavior:'smooth'});}
function scrollToTop(){window.scrollTo({top:0,behavior:'smooth'});}

document.addEventListener('keydown',e=>{
  if(e.key==='/' && document.activeElement!==document.getElementById('navbar-search')){
    e.preventDefault(); document.getElementById('navbar-search').focus();
  }
  if(e.key==='Escape'){
    closeAuthModal();
    document.querySelectorAll('#notifPanel,#profilePanel').forEach(p=>p.classList.add('hidden'));
    if(!mobileMenu.classList.contains('translate-x-full')) hamburgerBtn.click();
  }
});

const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('show'); revealObserver.unobserve(en.target); } });
},{threshold:.1,rootMargin:'0px 0px -80px 0px'});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));