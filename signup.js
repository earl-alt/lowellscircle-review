// Sign-ups go to Lowell's own Google Sheet (Apps Script web app) — paste its URL below.
// Until it's set, the form runs in draft mode: nothing is sent or stored anywhere.
const SIGNUP_ENDPOINT = '';

function signupMarkup(id){
  return `
  <form class="signup" id="${id}" novalidate>
    <p class="eye">If you can read this,<strong>get in the Circle.</strong></p>
    <div class="row">
      <label class="field"><span>First name</span><input name="first" autocomplete="given-name" required></label>
      <label class="field"><span>Last name</span><input name="last" autocomplete="family-name"></label>
    </div>
    <label class="field"><span>Email</span><input name="email" type="email" autocomplete="email" inputmode="email" required></label>
    <label class="field"><span>Mobile (optional, for texts)</span><input name="phone" type="tel" autocomplete="tel" inputmode="tel"></label>
    <fieldset>
      <legend>What do you make? Pick any.</legend>
      <div class="chips">
        ${['Draw','Paint','Photos','Film','Write','Music','Dance','Speak','Design','Ideas','Support those who do']
          .map(v=>`<label><input type="checkbox" name="makes" value="${v}"><span>${v}</span></label>`).join('')}
      </div>
    </fieldset>
    <button class="go" type="submit">I’m in</button>
    <p class="fine">We’ll send you the Lowell’s Circle booklet. Your information stays with Lowell. It isn’t sold or shared.</p>
  </form>
  <div class="thanks" id="${id}-thanks" hidden>
    <h2>You<span class="ap">’<svg viewBox="0 0 30 40" aria-hidden="true" focusable="false"><circle cx="15" cy="14" r="14"/><path d="M29 14C29 26 21 35 4 40L3 37C11 33 14 29 15 28Z"/></svg></span>re in.</h2>
    <p>Your Lowell’s Circle booklet is on its way.</p>
  </div>`;
}

function wireSignup(id){
  const f=document.getElementById(id), t=document.getElementById(id+'-thanks');
  f.addEventListener('submit',async e=>{
    e.preventDefault();
    const email=f.email, first=f.first;
    [email,first].forEach(i=>i.style.borderColor='');
    let ok=true;
    if(!first.value.trim()){first.style.borderColor='#af102c';ok=false}
    if(!/^\S+@\S+\.\S+$/.test(email.value)){email.style.borderColor='#af102c';ok=false}
    if(!ok){(first.value.trim()?email:first).focus();return}
    const data=new FormData(f);
    const payload={first:data.get('first'),last:data.get('last'),email:data.get('email'),phone:data.get('phone'),
      makes:data.getAll('makes').join(', '),source:location.pathname,ts:new Date().toISOString()};
    if(SIGNUP_ENDPOINT){
      try{await fetch(SIGNUP_ENDPOINT,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify(payload)})}catch(_){}
    }
    f.hidden=true;t.hidden=false;
  });
}
