 // Safe helpers
    const $ = s => document.querySelector(s);
    const $$ = s => Array.from(document.querySelectorAll(s));

    // Smooth scrolling for nav
    $$('.nav-links a').forEach(a=>{
      a.addEventListener('click', e=>{
        e.preventDefault();
        const id = a.getAttribute('href').slice(1);
        const el = document.getElementById(id);
        if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
      });
    });

    // Typing animation (type, delete, loop)
    (function(){
      const target = document.getElementById('type-target');
      const phrases = ['Aya Saouli','Web Developer','Mobile Developer'];
      let pIndex=0;let charIndex=0;let deleting=false;
      const typeSpeed=80, deleteSpeed=50, pause=1000;

      function tick(){
        const current = phrases[pIndex];
        if(!deleting){
          target.textContent = current.slice(0,charIndex+1);
          charIndex++;
          if(charIndex===current.length){
            deleting=true;
            setTimeout(tick,pause);
            return;
          }
        } else {
          target.textContent = current.slice(0,charIndex-1);
          charIndex--;
          if(charIndex===0){
            deleting=false;
            pIndex = (pIndex+1)%phrases.length;
          }
        }
        setTimeout(tick, deleting? deleteSpeed: typeSpeed);
      }
      tick();
    })();

    // Fade-in on scroll via IntersectionObserver
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting) entry.target.classList.add('visible');
      });
    },{threshold:0.12});
    $$('.fade-in').forEach(el=>observer.observe(el));

    // Projects - open project url in new tab
    function openProject(e,url){
      e.preventDefault();
      if(!url || url === '#') return alert('Please replace the href with your project live URL.');
      window.open(url,'_blank');
    }
    window.openProject = openProject;

    // Contact form basic validation & fake submit (you can hook to backend)
    $('#contact-form').addEventListener('submit', function(e){
      e.preventDefault();
      const name = $('#name').value.trim();
      const email = $('#email').value.trim();
      const message = $('#message').value.trim();
      const status = $('#form-status');
      if(!name || !email || !message){ status.textContent = 'Please fill all fields.'; return; }
      // simple email check
      if(!/\S+@\S+\.\S+/.test(email)){ status.textContent='Please enter a valid email.'; return; }
      status.textContent = 'Sending...';
      // Simulate network send
      setTimeout(()=>{
        status.textContent = 'Message sent. I will reply at ' + email + ' (demo).';
        $('#contact-form').reset();
      },800);
    });
    // Light / Dark Mode Toggle
    (function(){
      const toggle = document.getElementById('mode-toggle');
      const body = document.body;
      const storedMode = localStorage.getItem('theme');
      
      if(storedMode === 'light') {
        body.classList.add('light-mode');
        toggle.textContent = '🌙';
      }

      toggle.addEventListener('click', ()=>{
        body.classList.toggle('light-mode');
        const isLight = body.classList.contains('light-mode');
        toggle.textContent = isLight ? '🌙' : '🌞';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
      });
    })();

    // Chatbot logic — small preset Q&A
    (function(){
      const toggle = $('#chat-toggle');
      const box = $('#chatbox');
      const closeBtn = $('#chat-close');
      const messages = $('#chat-messages');
      const input = $('#chat-input');
      const sendBtn = $('#chat-send');
      const presets = {
        'hi':'Hi! I\'m Aya (dev). I work with web & mobile technologies.',
        'skills':'I know HTML, Tailwind CSS, Next.js, Django, React, Flutter, Python, Java, PostgreSQL, MongoDB.',
        'projects':'Key projects: Movies Bot, Receipt Management, Stock Manager.',
        'contact':'You can reach me via email (placeholder) or the contact form on this page.',
        'github':'https://github/ayasaouli',
        'linkedin':'https://linkedin.com/in/ayasaouli',  
        'email':'ayasaouli405@gmail.com'
      };

      function appendBubble(text,who='them'){
        const b = document.createElement('div');
        b.className = 'bubble ' + (who==='me' ? 'me':'');
        b.textContent = text;
        messages.appendChild(b);
        messages.scrollTop = messages.scrollHeight;
      }

      function answer(text){
        const key = text.toLowerCase().trim();
        for(const k in presets){ if(key.includes(k)){ appendBubble(presets[k]); return; } }
        appendBubble("I don't know that yet — you can edit the presets in the HTML.");
      }

      function openChat(){
        box.classList.add('open');
        toggle.setAttribute('aria-expanded','true');
        // seed
        messages.innerHTML = '';
        appendBubble('Hello! Ask me about Aya — try: skills, projects, contact');
      }
      function closeChat(){ box.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); }

      toggle.addEventListener('click', ()=>{
        if(box.classList.contains('open')) closeChat(); else openChat();
      });
      closeBtn.addEventListener('click', closeChat);

      // click outside to close
      document.addEventListener('click', (e)=>{
        if(!box.contains(e.target) && !toggle.contains(e.target)) closeChat();
      });

      sendBtn.addEventListener('click', ()=>{
        const v = input.value.trim(); if(!v) return;
        appendBubble(v,'me'); input.value='';
        setTimeout(()=>answer(v),600);
      });
      input.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); sendBtn.click(); } });
    })();

    // small accessibility: display current year
    document.getElementById('year').textContent = new Date().getFullYear();