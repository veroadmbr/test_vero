
      {deleteMemberModal && <DeleteMemberModal
        member={deleteMemberModal}
        onClose={()=>setDeleteMemberModal(null)}
        onConfirm={member=>{
          setStaff(p=>p.filter(s=>s.id!==member.id));
          setDeleteMemberModal(null);
          (async()=>{const r=await db.deleteStaff(member.id);if(r?.error)console.error(r.error)})();
        }}
      />}import { useState, useEffect, useRef } from "react";
import { db, fromDbStaff, fromDbTemplate, fromDbChecklist, fromDbTask, fromDbAlert, fromDbSector } from "./supabase";

const Icon = ({ n, s = 20, c = "currentColor", style: sx }) => (
  <span className="material-icons-round"
    style={{ fontSize: s, color: c, lineHeight: 1, display: "inline-flex",
             alignItems: "center", userSelect: "none", flexShrink: 0, ...sx }}>
    {n}
  </span>
);

/* ═══ VERO LOGO ════════════════════════════════════════════════════════════ */
const VeroLogo = ({ height = 32 }) => {
  const w = Math.round(height * 2799 / 1272);
  return (
    <svg width={w} height={height} viewBox="0 0 2799 1272" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M391.881 1234.67C384.549 1249.66 363.16 1249.61 355.903 1234.58L13.855 526.145C7.44308 512.865 17.1186 497.449 31.8656 497.449H239.301C247.052 497.449 254.105 501.927 257.401 508.942L354.722 716.031C361.851 731.201 383.359 731.398 390.764 716.361L737.902 11.5146C741.268 4.67973 748.225 0.351074 755.844 0.351074H963.358C978.148 0.351074 987.822 15.8492 981.326 29.1362L391.881 1234.67Z" fill="#9015A8"/>
      <path d="M525.069 1245.83H374.097L347.699 1054.92L591.811 1022.69L525.069 1245.83Z" fill="#9015A8"/>
      <path d="M541.881 1234.67C534.549 1249.66 513.16 1249.61 505.903 1234.58L163.855 526.145C157.443 512.865 167.119 497.449 181.866 497.449H389.301C397.052 497.449 404.105 501.927 407.401 508.942L504.722 716.031C511.851 731.201 533.359 731.398 540.764 716.361L887.902 11.5146C891.268 4.67973 898.225 0.351074 905.844 0.351074H1113.36C1128.15 0.351074 1137.82 15.8492 1131.33 29.1362L541.881 1234.67Z" fill="#39E5B7"/>
      <path d="M2429.36 1271.65C2224.96 1271.65 2058.36 1106.45 2058.36 900.649C2058.36 696.249 2224.96 531.049 2429.36 531.049C2633.76 531.049 2798.96 696.249 2798.96 900.649C2798.96 1106.45 2633.76 1271.65 2429.36 1271.65ZM2429.36 1047.65C2509.16 1047.65 2574.96 981.849 2574.96 900.649C2574.96 820.849 2509.16 755.049 2429.36 755.049C2348.16 755.049 2282.36 820.849 2282.36 900.649C2282.36 981.849 2348.16 1047.65 2429.36 1047.65Z" fill="#9015A8"/>
      <path d="M1603.72 1271.65C1592.68 1271.65 1583.72 1262.69 1583.72 1251.65V573.449C1583.72 562.403 1592.68 553.449 1603.72 553.449H1703.72C1714.77 553.449 1723.72 562.403 1723.72 573.449V626.819C1723.72 640.775 1737.66 650.44 1750.73 645.553L2007.52 549.545C2020.59 544.658 2034.52 554.323 2034.52 568.278V765.03C2034.52 773.347 2029.38 780.795 2021.6 783.737L1829.05 856.56C1821.27 859.502 1816.12 866.951 1816.12 875.267V1251.65C1816.12 1262.69 1807.17 1271.65 1796.12 1271.65H1603.72Z" fill="#9015A8"/>
      <path d="M1163.93 1271.65C959.528 1271.65 792.928 1106.45 792.928 900.649C792.928 696.249 959.528 531.049 1163.93 531.049C1395.41 531.049 1554.05 737.646 1531.65 937.023C1530.56 946.755 1522.14 953.849 1512.35 953.849H1049.74C1035.85 953.849 1026.3 967.713 1033.49 979.608C1059.93 1023.39 1108.44 1053.25 1163.93 1053.25C1201.58 1053.25 1234.42 1040 1260.2 1017.98C1264.1 1014.66 1268.98 1012.65 1274.1 1012.65H1489.46C1502.97 1012.65 1512.58 1025.78 1507.59 1038.34C1452.91 1175.91 1319.61 1271.65 1163.93 1271.65ZM1051.35 798.613C1040.93 809.931 1050.14 826.449 1065.52 826.449H1261.84C1277.02 826.449 1286.27 810.297 1276.16 798.972C1248.9 768.442 1209 749.449 1163.93 749.449C1119.03 749.449 1079.27 768.294 1051.35 798.613Z" fill="#9015A8"/>
    </svg>
  );
};


const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Material+Icons+Round&display=swap');
    @keyframes spin{to{transform:rotate(360deg)}}
    @font-face{font-family:'Gilroy';src:url('https://cdn.jsdelivr.net/npm/gilroy-font@1.0.0/Gilroy-SemiBold.woff2') format('woff2');font-weight:600;font-display:swap;}
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    :root{
      /* Background */
      --bg:#ffffff;--surface:#f5f6f8;--border:#e3e5e8;--border2:#cdd0d6;
      /* Text */
      --text:#1f1f24;--sub:#6b6f76;--muted:#9ca3af;
      /* Primary – Roxo Vero */
      --accent:#8b2bbf;--accent-hover:#6f1fa0;--abg:#f5ecfb;--abr:#d8b4fe;
      /* Secondary – Verde Vero */
      --sec:#39d4a3;--sec-hover:#23b889;--sbg:#e6faf5;--sbr:#6ee7d2;
      /* Success */
      --green:#22c55e;--gbg:#f0fdf4;--gbr:#bbf7d0;
      /* Warning */
      --warn:#f59e0b;--wbg:#fffbeb;--wbr:#fde68a;
      /* Error */
      --red:#ef4444;--rbg:#fef2f2;--rbr:#fecaca;
      /* Info */
      --blue:#3b82f6;--bbg:#eff6ff;--bbr:#bfdbfe;
      /* Layout */
      --sw:240px;--bnh:64px;--r:12px;--rs:8px;
      --sh:0 1px 3px rgba(0,0,0,.07),0 1px 2px rgba(0,0,0,.04);
      --shm:0 4px 16px rgba(139,43,191,.12);
      --fh:'Gilroy','Nunito',system-ui,sans-serif;
      --fb:'Inter',system-ui,sans-serif;
    }
    html{font-size:16px;-webkit-text-size-adjust:100%;}
    body{background:var(--bg);color:var(--text);font-family:var(--fb);min-height:100dvh;-webkit-font-smoothing:antialiased;}
    input,select,textarea,button{font-family:var(--fb);font-size:14px;}
    ::-webkit-scrollbar{width:5px;height:5px;}
    ::-webkit-scrollbar-track{background:transparent;}
    ::-webkit-scrollbar-thumb{background:var(--border2);border-radius:10px;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    .fu{animation:fadeUp .28s ease both;}
    .app{display:flex;min-height:100dvh;}
    .sb{width:var(--sw);flex-shrink:0;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto;}
    .ma{flex:1;overflow-y:auto;min-height:100dvh;}
    .bdy{display:flex;flex:1;}
    .bn{display:none;}
    .mh{display:none;}
    @media(max-width:768px){
      .app{flex-direction:column;}
      .bdy{flex:1;}
      .sb{display:none;}
      .bn{display:flex;position:fixed;bottom:0;left:0;right:0;height:var(--bnh);background:var(--surface);border-top:1px solid var(--border);z-index:200;align-items:center;justify-content:space-around;}
      .mh{display:flex;height:52px;align-items:center;justify-content:space-between;padding:0 16px;border-bottom:1px solid var(--border);background:var(--surface);position:sticky;top:0;z-index:150;}
      .ma{padding-bottom:calc(var(--bnh)+8px);min-height:unset;}
      .pp{padding:16px 14px 8px!important;}
      .g4{grid-template-columns:repeat(2,1fr)!important;}
      .g2{grid-template-columns:1fr!important;}
      .cg{grid-template-columns:1fr!important;}
    }
    @media(min-width:769px){
      .pp{padding:28px 32px 16px;}
      .g4{grid-template-columns:repeat(4,1fr);}
      .g2{grid-template-columns:1fr 1fr;}
      .cg{grid-template-columns:repeat(auto-fill,minmax(300px,1fr));}
    }
  `}</style>
);

/* ─── SEED DATA ──────────────────────────────────────────────────────────── */
const mk=(id,t,done=false,ev=null,et="",crit=false)=>({id,t,done,ev,et,crit,eo:false});
// eslint-disable-next-line no-unused-vars
const S0=[
  {id:"s1",name:"Larissa Admin",  firstName:"Larissa", lastName:"Admin",   email:"larissa@vero.com",  phone:"",role:"Administradora",av:"LA",score:95,admin:true, status:"approved",password:"larissa123", memberRole:"admin",  sector:null},
  {id:"s2",name:"Walter Admin",   firstName:"Walter",  lastName:"Admin",   email:"walter@vero.com",   phone:"",role:"Administrador",  av:"WA",score:92,admin:true, status:"approved",password:"walter123",  memberRole:"admin",  sector:null},
  {id:"s3",name:"Jaqueline Lider",firstName:"Jaqueline",lastName:"Lider", email:"jaqueline@vero.com",phone:"",role:"Líder",          av:"JL",score:88,admin:false,status:"approved",password:"jaqueline123",memberRole:"leader", sector:"sec1"},
  {id:"s4",name:"Victoria Lider", firstName:"Victoria",lastName:"Lider",  email:"victoria.l@vero.com",phone:"",role:"Líder",         av:"VL",score:85,admin:false,status:"approved",password:"victoria123", memberRole:"leader", sector:"sec2"},
  {id:"s5",name:"Rafael Lider",   firstName:"Rafael",  lastName:"Lider",  email:"rafael@vero.com",   phone:"",role:"Líder",          av:"RL",score:82,admin:false,status:"approved",password:"rafael123",   memberRole:"leader", sector:"sec3"},
  {id:"s6",name:"Anderson Equipe",firstName:"Anderson",lastName:"Equipe", email:"anderson@vero.com", phone:"",role:"Equipe",         av:"AE",score:70,admin:false,status:"approved",password:"anderson123", memberRole:"base",   sector:"sec1"},
  {id:"s7",name:"Victoria Equipe",firstName:"Victoria",lastName:"Equipe", email:"victoria.e@vero.com",phone:"",role:"Equipe",        av:"VE",score:68,admin:false,status:"approved",password:"victoria123", memberRole:"base",   sector:"sec2"},
];


const CATS=["Operacional","Financeiro","Higiene","Seguranca","Atendimento","Estoque","Outro"];

const EMOJIS=["🌅","💰","🧹","🌡️","🍽️","📦","🔥","🧊","🧴","🛒","📋","⚙️","🔍","🏪","🚿","🧂","🥩","🍳","📊","🎯"];

const FREQ_OPTS=[
  {id:"daily",      label:"Diariamente",  icon:"today",          hasDays:false},
  {id:"twice_week", label:"2x por semana",icon:"date_range",     hasDays:true},
  {id:"three_week", label:"3x por semana",icon:"date_range",     hasDays:true},
  {id:"weekly",     label:"1x por semana",icon:"view_week",      hasDays:true},
  {id:"monthly",    label:"1x por mes",   icon:"calendar_month", hasDays:true},
  {id:"yearly",     label:"1x por ano",   icon:"event",          hasDays:false},
];
const WEEKDAYS=[
  {id:0,short:"Dom",label:"Domingo"},
  {id:1,short:"Seg",label:"Segunda"},
  {id:2,short:"Ter",label:"Terca"},
  {id:3,short:"Qua",label:"Quarta"},
  {id:4,short:"Qui",label:"Quinta"},
  {id:5,short:"Sex",label:"Sexta"},
  {id:6,short:"Sab",label:"Sabado"},
];
const FREQ_LABEL=(freq,days)=>{
  const f=FREQ_OPTS.find(x=>x.id===freq);
  if(!f)return "";
  if(f.hasDays&&days&&days.length>0) return `${f.label} (${days.map(d=>WEEKDAYS.find(w=>w.id===d)?.short).join(", ")})`;
  return f.label;
};

/* ─── HELPERS ────────────────────────────────────────────────────────────── */
const pct=items=>!items.length?0:Math.round(items.filter(i=>i.done).length/items.length*100);
const SL={in_progress:"Em andamento",done:"Concluído",alert:"Alerta",pending:"Pendente"};
const SC={in_progress:"var(--warn)",done:"var(--green)",alert:"var(--red)",pending:"var(--muted)"};
const SB={in_progress:"var(--wbg)",done:"var(--gbg)",alert:"var(--rbg)",pending:"var(--surface)"};
const TC={danger:"var(--red)",warning:"var(--warn)",success:"var(--accent)",info:"var(--blue)"};
const TB={danger:"var(--rbg)",warning:"var(--wbg)",success:"var(--gbg)",info:"var(--bbg)"};
const TBR={danger:"var(--rbr)",warning:"var(--wbr)",success:"var(--gbr)",info:"var(--bbr)"};
const TI={danger:"error_outline",warning:"warning_amber",success:"check_circle_outline",info:"info"};
const NAV_ADMIN=[
  {id:"dashboard",label:"Painel",icon:"dashboard"},
  {id:"checklists",label:"Checklists",icon:"checklist"},
  {id:"tasks",label:"Tarefas",icon:"task_alt"},
  {id:"templates",label:"Templates",icon:"view_quilt"},
  {id:"staff",label:"Equipe",icon:"group"},
  {id:"alerts",label:"Alertas",icon:"notifications"},
];

/* ─── SHARED PRIMITIVES ──────────────────────────────────────────────────── */
const Av=({v,sz=34,bg="var(--border)",co="#4b5563"})=>(
  <div style={{width:sz,height:sz,borderRadius:"50%",background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--fh)",fontWeight:600,fontSize:sz*.36,color:co,flexShrink:0}}>{v}</div>
);
const Pill=({ch,c="var(--accent)",b="var(--abg)",br="var(--abr)"})=>(
  <span style={{background:b,color:c,border:`1px solid ${br}`,borderRadius:100,padding:"2px 9px",fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>{ch}</span>
);
const SPill=({s})=><Pill ch={SL[s]} c={SC[s]} b={SB[s]} br={SB[s]}/>;
const Bar=({v,h=4})=>(
  <div style={{background:"var(--border)",borderRadius:100,height:h,overflow:"hidden"}}>
    <div style={{height:"100%",borderRadius:100,width:`${v}%`,transition:"width .6s ease",background:v>=80?"var(--green)":v>=50?"var(--warn)":"var(--red)"}}/>
  </div>
);
const Card=({children,style,onClick})=>(<div onClick={onClick} style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r)",boxShadow:"var(--sh)",cursor:onClick?"pointer":"default",...style}}>{children}</div>);
const Btn=({onClick,children,v="p",sz="m",dis,style})=>{
  const sizes={s:{padding:"5px 10px",fontSize:12},m:{padding:"9px 15px",fontSize:13},l:{padding:"12px 22px",fontSize:14}};
  const hov={p:"var(--accent-hover)",o:null,g:null,d:null};
  const vars={p:{background:"var(--accent)",color:"#fff",border:"none"},o:{background:"transparent",border:"1px solid var(--border2)",color:"var(--text)"},g:{background:"transparent",border:"none",color:"var(--sub)"},d:{background:"var(--rbg)",color:"var(--red)",border:"1px solid var(--rbr)"}};
  return <button onClick={onClick} disabled={dis} style={{borderRadius:"var(--rs)",cursor:dis?"not-allowed":"pointer",fontWeight:600,display:"inline-flex",alignItems:"center",justifyContent:"center",gap:5,transition:"all .15s",opacity:dis?.45:1,...sizes[sz],...vars[v],...style}}
    onMouseEnter={e=>{if(!dis){if(hov[v])e.currentTarget.style.background=hov[v];else e.currentTarget.style.opacity=".8";}}}
    onMouseLeave={e=>{if(!dis){if(hov[v])e.currentTarget.style.background=vars[v].background;else e.currentTarget.style.opacity="1";}}}
  >{children}</button>;
};
const Inp=({val,onChange,ph,type="text",style})=>(
  <input value={val} onChange={onChange} placeholder={ph} type={type} style={{width:"100%",background:"var(--bg)",border:"1px solid var(--border2)",borderRadius:"var(--rs)",padding:"10px 12px",color:"var(--text)",fontSize:13,outline:"none",...style}} onFocus={e=>e.target.style.borderColor="var(--accent)"} onBlur={e=>e.target.style.borderColor="var(--border2)"}/>
);
const Sel=({val,onChange,children})=>(
  <select value={val} onChange={onChange} style={{width:"100%",background:"var(--bg)",border:"1px solid var(--border2)",borderRadius:"var(--rs)",padding:"10px 12px",color:"var(--text)",fontSize:13,outline:"none"}}>{children}</select>
);
const Lbl=({children})=>(<div style={{fontSize:11,fontWeight:600,color:"var(--sub)",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:5,marginTop:14}}>{children}</div>);
const Hr=()=><div style={{height:1,background:"var(--border)",margin:"4px 0"}}/>;
const Ov=({onClick,children})=>(<div onClick={onClick} style={{position:"fixed",inset:0,background:"rgba(17,24,39,.45)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:500,backdropFilter:"blur(3px)"}}>{children}</div>);
const Sheet=({onClick,children,style})=>(<div onClick={onClick} style={{background:"var(--surface)",borderRadius:"20px 20px 0 0",width:"100%",maxWidth:580,maxHeight:"92dvh",overflowY:"auto",animation:"slideUp .25s ease",padding:"20px 24px 40px",...style}}><div style={{width:36,height:4,background:"var(--border2)",borderRadius:10,margin:"0 auto 18px"}}/>{children}</div>);
const Confirm=({msg,onOk,onCancel})=>(
  <Ov onClick={onCancel}>
    <Sheet onClick={e=>e.stopPropagation()} style={{maxWidth:360,padding:"28px 24px"}}>
      <div style={{textAlign:"center"}}>
        <Icon n="delete_forever" s={36} c="var(--red)"/>
        <div style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:17,margin:"12px 0 8px"}}>Tem certeza?</div>
        <div style={{color:"var(--sub)",fontSize:13,lineHeight:1.6,marginBottom:22}}>{msg}</div>
        <div style={{display:"flex",gap:10}}>
          <Btn v="o" onClick={onCancel} style={{flex:1}}>Cancelar</Btn>
          <Btn v="d" onClick={onOk} style={{flex:1}}><Icon n="delete" s={20}/>Deletar</Btn>
        </div>
      </div>
    </Sheet>
  </Ov>
);



/* ═══ REGISTER SCREEN ════════════════════════════════════════════════════════
   Self-registration: nome, sobrenome, email, celular, senha, confirmação.
   Admin also needs secret PIN "1109". Team accounts go to pending.
══════════════════════════════════════════════════════════════════════════════*/
function RegisterScreen({ onBack, onRegistered }) {
  const [step,      setStep]   = useState("form"); // "form"|"success"
  const [firstName, setFirst]  = useState("");
  const [lastName,  setLast]   = useState("");
  const [email,     setEmail]  = useState("");
  const [phone,     setPhone]  = useState("");
  const [password,  setPass]   = useState("");
  const [confirm,   setConf]   = useState("");
  const [role,      setRole]   = useState("Equipe");
  const [adminPin,  setAdmPin] = useState("");
  const [errors,    setErrors] = useState({});
  const [showPass,  setShowP]  = useState(false);
  const [showConf,  setShowC]  = useState(false);
  const [sub,       setSub]    = useState(false);

  const av = ((firstName[0]||"")+(lastName[0]||"")).toUpperCase() || "??";

  const validate = () => {
    const e = {};
    if (!firstName.trim()) e.firstName = "Campo obrigatório";
    if (!lastName.trim())  e.lastName  = "Campo obrigatório";
    if (!email.includes("@") || !email.includes(".")) e.email = "E-mail inválido";
    if (phone.replace(/\D/g,"").length < 8) e.phone = "Número inválido";
    if (password.length < 6) e.password = "Mínimo 6 caracteres";
    if (password !== confirm) e.confirm = "As senhas não coincidem";
    if (role === "Admin" && adminPin !== "1109") e.adminPin = "PIN secreto incorreto";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSub(true);
    setTimeout(() => {
      const newUser = {
        id:        "u" + Date.now(),
        name:      firstName.trim() + " " + lastName.trim(),
        firstName: firstName.trim(),
        lastName:  lastName.trim(),
        email:     email.trim().toLowerCase(),
        phone:     phone.trim(),
        password,
        role:      role === "Admin" ? "Administrador" : "Equipe",
        av,
        score:     0,
        admin:     role === "Admin",
        status:    role === "Admin" ? "approved" : "pending",
        memberRole: role === "Admin" ? "admin" : "base",
        sector:    null,
      };
      onRegistered(newUser);
      setSub(false);
      setStep("success");
    }, 700);
  };



  if (step === "success") return (
    <div style={{ minHeight:"100dvh", background:"linear-gradient(135deg,#f0eaff 0%,#f5f6f8 60%)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <G/>
      <div className="fu" style={{ maxWidth:400, width:"100%", textAlign:"center" }}>
        <div style={{ width:80, height:80, borderRadius:"50%", background:"var(--abg)", border:"2px solid var(--abr)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 22px" }}>
          <Icon n="check_circle" s={42} c="var(--accent)"/>
        </div>
        <div style={{ fontFamily:"var(--fh)", fontWeight:600, fontSize:24, marginBottom:12 }}>
          {role==="Admin" ? "Conta criada com sucesso!" : "Cadastro enviado!"}
        </div>
        <div style={{ fontSize:14, color:"var(--sub)", lineHeight:1.7, marginBottom:32 }}>
          {role==="Admin"
            ? <>Sua conta de administrador foi criada.<br/>Você já pode fazer login com seu e-mail e senha.</>
            : <>Seu cadastro foi enviado para análise.<br/>Você receberá um e-mail em <strong>{email}</strong><br/>assim que for aprovado ou reprovado.</>}
        </div>
        <Btn onClick={onBack} style={{ width:"100%", justifyContent:"center", padding:"13px", fontSize:15 }}>
          <Icon n="login" s={20}/>Ir para o Login
        </Btn>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100dvh", background:"linear-gradient(135deg,#f0eaff 0%,#f5f6f8 60%)", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px 24px 48px" }}>
      <G/>
      <div className="fu" style={{ maxWidth:460, width:"100%" }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:"var(--sub)", cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontSize:13, marginBottom:28, fontWeight:500 }}>
          <Icon n="arrow_back" s={18} c="var(--sub)"/>Voltar ao login
        </button>

        <div style={{ marginBottom:24 }}>
          <div style={{ fontFamily:"var(--fh)", fontWeight:600, fontSize:26, marginBottom:6 }}>Criar conta</div>
          <div style={{ fontSize:13, color:"var(--sub)" }}>Preencha seus dados para se cadastrar no Vero</div>
        </div>

        {/* Role toggle */}
        <div style={{ display:"flex", gap:6, marginBottom:22, background:"var(--bg)", border:"1px solid var(--border2)", borderRadius:"var(--rs)", padding:4 }}>
          {[["Equipe","badge","var(--blue)","var(--bbg)"],["Admin","admin_panel_settings","var(--accent)","var(--abg)"]].map(([r,ic,col,bg])=>(
            <button key={r} onClick={()=>{ setRole(r); setAdmPin(""); setErrors({}); }}
              style={{ flex:1, padding:"10px", borderRadius:6, border:"none", background:role===r?bg:"transparent", color:role===r?col:"var(--sub)", fontWeight:600, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6, transition:"all .18s" }}>
              <Icon n={ic} s={18} c={role===r?col:"var(--sub)"}/>
              {r==="Admin"?"Administrador":r}
            </button>
          ))}
        </div>

        {/* Name row */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div>
          <Lbl>Nome *</Lbl>
          <div style={{ position:"relative" }}>
            <input value={firstName} onChange={e=>{ setFirst(e.target.value); setErrors(p=>({...p,firstName:""}));}}
              placeholder="João" type={"text"}
              style={{ width:"100%", background:"var(--bg)", border:"1px solid var(--border2)", borderRadius:"var(--rs)", padding:`10px 12px 10px 12px`, color:"var(--text)", fontSize:13, outline:"none" }}
              onFocus={e=>e.target.style.borderColor="var(--accent)"}
              onBlur={e=>e.target.style.borderColor="var(--border2)"}/>
          </div>
          {errors.firstName&&<div style={{ fontSize:11, color:"var(--red)", marginTop:4, display:"flex", alignItems:"center", gap:3 }}><Icon n="error_outline" s={13} c="var(--red)"/>{errors.firstName}</div>}
        </div>
          <div>
          <Lbl>Sobrenome *</Lbl>
          <div style={{ position:"relative" }}>
            <input value={lastName} onChange={e=>{ setLast(e.target.value); setErrors(p=>({...p,lastName:""}));}}
              placeholder="Silva" type={"text"}
              style={{ width:"100%", background:"var(--bg)", border:"1px solid var(--border2)", borderRadius:"var(--rs)", padding:`10px 12px 10px 12px`, color:"var(--text)", fontSize:13, outline:"none" }}
              onFocus={e=>e.target.style.borderColor="var(--accent)"}
              onBlur={e=>e.target.style.borderColor="var(--border2)"}/>
          </div>
          {errors.lastName&&<div style={{ fontSize:11, color:"var(--red)", marginTop:4, display:"flex", alignItems:"center", gap:3 }}><Icon n="error_outline" s={13} c="var(--red)"/>{errors.lastName}</div>}
        </div>
        </div>

        <div>
          <Lbl>E-mail *</Lbl>
          <div style={{ position:"relative" }}>
            <input value={email} onChange={e=>{ setEmail(e.target.value); setErrors(p=>({...p,email:""}));}}
              placeholder="joao@restaurante.com" type={"email"}
              style={{ width:"100%", background:"var(--bg)", border:"1px solid var(--border2)", borderRadius:"var(--rs)", padding:`10px 12px 10px 12px`, color:"var(--text)", fontSize:13, outline:"none" }}
              onFocus={e=>e.target.style.borderColor="var(--accent)"}
              onBlur={e=>e.target.style.borderColor="var(--border2)"}/>
          </div>
          {errors.email&&<div style={{ fontSize:11, color:"var(--red)", marginTop:4, display:"flex", alignItems:"center", gap:3 }}><Icon n="error_outline" s={13} c="var(--red)"/>{errors.email}</div>}
        </div>
        <div>
          <Lbl>Celular *</Lbl>
          <div style={{ position:"relative" }}>
            <input value={phone} onChange={e=>{ setPhone(e.target.value); setErrors(p=>({...p,phone:""}));}}
              placeholder="(11) 99999-9999" type={"tel"}
              style={{ width:"100%", background:"var(--bg)", border:"1px solid var(--border2)", borderRadius:"var(--rs)", padding:`10px 12px 10px 12px`, color:"var(--text)", fontSize:13, outline:"none" }}
              onFocus={e=>e.target.style.borderColor="var(--accent)"}
              onBlur={e=>e.target.style.borderColor="var(--border2)"}/>
          </div>
          {errors.phone&&<div style={{ fontSize:11, color:"var(--red)", marginTop:4, display:"flex", alignItems:"center", gap:3 }}><Icon n="error_outline" s={13} c="var(--red)"/>{errors.phone}</div>}
        </div>

        {/* Password row */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div>
          <Lbl>Senha *</Lbl>
          <div style={{ position:"relative" }}>
            <input value={password} onChange={e=>{ setPass(e.target.value); setErrors(p=>({...p,password:""}));}}
              placeholder="Mín. 6 caracteres" type={(showPass?"text":"password")}
              style={{ width:"100%", background:"var(--bg)", border:"1px solid var(--border2)", borderRadius:"var(--rs)", padding:`10px 42px 10px 12px`, color:"var(--text)", fontSize:13, outline:"none" }}
              onFocus={e=>e.target.style.borderColor="var(--accent)"}
              onBlur={e=>e.target.style.borderColor="var(--border2)"}/>
            <button onClick={()=>setShowP(p=>!p)} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center" }}>
              <Icon n={showPass?"visibility_off":"visibility"} s={18} c="var(--muted)"/>
            </button>
          </div>
          {errors.password&&<div style={{ fontSize:11, color:"var(--red)", marginTop:4, display:"flex", alignItems:"center", gap:3 }}><Icon n="error_outline" s={13} c="var(--red)"/>{errors.password}</div>}
        </div>
          <div>
          <Lbl>Confirmar Senha *</Lbl>
          <div style={{ position:"relative" }}>
            <input value={confirm} onChange={e=>{ setConf(e.target.value); setErrors(p=>({...p,confirm:""}));}}
              placeholder="Repita a senha" type={(showConf?"text":"password")}
              style={{ width:"100%", background:"var(--bg)", border:"1px solid var(--border2)", borderRadius:"var(--rs)", padding:`10px 42px 10px 12px`, color:"var(--text)", fontSize:13, outline:"none" }}
              onFocus={e=>e.target.style.borderColor="var(--accent)"}
              onBlur={e=>e.target.style.borderColor="var(--border2)"}/>
            <button onClick={()=>setShowC(p=>!p)} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center" }}>
              <Icon n={showConf?"visibility_off":"visibility"} s={18} c="var(--muted)"/>
            </button>
          </div>
          {errors.confirm&&<div style={{ fontSize:11, color:"var(--red)", marginTop:4, display:"flex", alignItems:"center", gap:3 }}><Icon n="error_outline" s={13} c="var(--red)"/>{errors.confirm}</div>}
        </div>
        </div>

        {/* Password strength */}
        {password.length > 0 && (
          <div style={{ marginTop:6 }}>
            <div style={{ display:"flex", gap:4, marginBottom:4 }}>
              {[1,2,3,4].map(l=>(
                <div key={l} style={{ flex:1, height:3, borderRadius:100, background: password.length >= l*2 ? (password.length>=8?"var(--accent)":password.length>=5?"var(--warn)":"var(--red)") : "var(--border)", transition:"all .3s" }}/>
              ))}
            </div>
            <div style={{ fontSize:11, color:"var(--muted)" }}>
              {password.length < 5 ? "Fraca" : password.length < 8 ? "Média" : "Forte"}
            </div>
          </div>
        )}

        {role==="Admin" && (
          <div>
          <Lbl>PIN Secreto de Administrador *</Lbl>
          <div style={{ position:"relative" }}>
            <input value={adminPin} onChange={e=>{ setAdmPin(e.target.value); setErrors(p=>({...p,adminPin:""}));}}
              placeholder="••••" type={(false?"text":"password")}
              style={{ width:"100%", background:"var(--bg)", border:"1px solid var(--border2)", borderRadius:"var(--rs)", padding:`10px 42px 10px 12px`, color:"var(--text)", fontSize:13, outline:"none" }}
              onFocus={e=>e.target.style.borderColor="var(--accent)"}
              onBlur={e=>e.target.style.borderColor="var(--border2)"}/>
            <button onClick={()=>setShowP(p=>!p)} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center" }}>
              <Icon n={false?"visibility_off":"visibility"} s={18} c="var(--muted)"/>
            </button>
          </div>
          {errors.adminPin&&<div style={{ fontSize:11, color:"var(--red)", marginTop:4, display:"flex", alignItems:"center", gap:3 }}><Icon n="error_outline" s={13} c="var(--red)"/>{errors.adminPin}</div>}
        </div>
        )}

        {role==="Admin" && (
          <div style={{ marginTop:10, background:"var(--wbg)", border:"1px solid var(--wbr)", borderRadius:"var(--rs)", padding:"10px 14px", fontSize:12, color:"#92400e", display:"flex", gap:8, alignItems:"flex-start", lineHeight:1.5 }}>
            <Icon n="info" s={16} c="var(--warn)" style={{marginTop:1,flexShrink:0}}/>
            O PIN secreto é fornecido pelo responsável do sistema. Sem ele não é possível criar uma conta de administrador.
          </div>
        )}
        {role==="Equipe" && (
          <div style={{ marginTop:14, background:"var(--bbg)", border:"1px solid #bfdbfe", borderRadius:"var(--rs)", padding:"10px 14px", fontSize:12, color:"var(--blue)", display:"flex", gap:8, alignItems:"flex-start", lineHeight:1.5 }}>
            <Icon n="info" s={16} c="var(--blue)" style={{marginTop:1,flexShrink:0}}/>
            Após o envio, um administrador revisará e aprovará seu cadastro. Você será notificado por e-mail.
          </div>
        )}

        <Btn onClick={handleSubmit} dis={sub}
          style={{ width:"100%", justifyContent:"center", marginTop:24, padding:"14px", fontSize:15 }}>
          {sub ? <Icon n="hourglass_top" s={20} c="#fff"/> : <Icon n="person_add" s={20} c="#fff"/>}
          {sub ? "Enviando..." : role==="Admin" ? "Criar conta de Administrador" : "Enviar para aprovação"}
        </Btn>
      </div>
    </div>
  );
}

/* ═══ LOGIN SCREEN ════════════════════════════════════════════════════════════
   Email + password login for both Admin and Team members.
   No PIN numpad — clean form-based approach.
══════════════════════════════════════════════════════════════════════════════*/
function LoginScreen({ allStaff, onLogin, onRegister }) {
  const [mode,     setMode]    = useState(null); // null|"admin"|"team"
  const [email,    setEmail]   = useState("");
  const [password, setPass]    = useState("");
  const [showPass, setShowP]   = useState(false);
  const [err,      setErr]     = useState("");
  const [loading,  setLoading] = useState(false);

  const reset = (m) => { setMode(m); setEmail(""); setPass(""); setErr(""); setShowP(false); };

  const submit = async () => {
    if (!email || !password) { setErr("Preencha e-mail e senha."); return; }
    setLoading(true);
    try {
      // Query DB directly to always get fresh password (bypasses stale allStaff state)
      const { data, error } = await import("./supabase").then(m =>
        m.supabase.from("staff").select("*")
          .eq("email", email.trim().toLowerCase())
          .eq("status", "approved")
          .single()
      );
      if (error || !data) { setErr("E-mail ou senha incorretos."); setLoading(false); return; }
      if (data.password !== password) { setErr("E-mail ou senha incorretos."); setLoading(false); return; }
      // Check mode matches
      if (mode === "admin" && !data.admin) { setErr("Esta conta não tem acesso de administrador."); setLoading(false); return; }
      if (mode === "team"  &&  data.admin) { setErr("Use o acesso de Administrador para esta conta."); setLoading(false); return; }
      // Build user object from DB row
      const user = {
        id: data.id, name: data.name, firstName: data.first_name, lastName: data.last_name,
        email: data.email, phone: data.phone, role: data.role, av: data.av,
        score: data.score, admin: data.admin, status: data.status, password: data.password,
        memberRole: data.member_role, sector: data.sector,
      };
      onLogin({ role: mode === "admin" ? "admin" : (user.memberRole==="leader" ? "leader" : "team"), user });
    } catch(e) {
      setErr("Erro de conexão. Tente novamente.");
    }
    setLoading(false);
  };

  const handleKey = (e) => { if (e.key === "Enter") submit(); };

  /* ── Mode picker ── */
  if (!mode) return (
    <div style={{ minHeight:"100dvh", background:"linear-gradient(135deg,#f0eaff 0%,#f5f6f8 60%)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <G/>
      <div className="fu" style={{ width:"100%", maxWidth:420 }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{marginBottom:10,display:"flex",justifyContent:"center"}}>
            <VeroLogo height={44}/>
          </div>
          <div style={{ fontSize:14, color:"var(--sub)" }}>Gestão Operacional de Restaurantes</div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:16 }}>
          {[
            {m:"admin",icon:"admin_panel_settings",label:"Administrador",sub:"Acesso completo — gerencie toda a operação",col:"var(--accent)",bg:"var(--abg)",bdr:"var(--abr)"},
            {m:"team", icon:"badge",               label:"Equipe",       sub:"Veja e execute suas tarefas atribuídas",  col:"var(--blue)", bg:"var(--bbg)",bdr:"var(--bbr)"},
          ].map(({m,icon,label,sub,col,bg,bdr})=>(
            <button key={m} onClick={()=>reset(m)}
              style={{ background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"var(--r)", padding:"20px 22px", cursor:"pointer", display:"flex", alignItems:"center", gap:14, textAlign:"left", transition:"all .2s", boxShadow:"var(--sh)" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor=col; e.currentTarget.style.boxShadow="var(--shm)"; e.currentTarget.style.background=bg; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.boxShadow="var(--sh)"; e.currentTarget.style.background="var(--surface)"; }}>
              <div style={{ width:50, height:50, borderRadius:"var(--rs)", background:bg, border:`1px solid ${bdr}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Icon n={icon} s={26} c={col}/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"var(--fh)", fontWeight:600, fontSize:16 }}>{label}</div>
                <div style={{ fontSize:12, color:"var(--sub)", marginTop:3 }}>{sub}</div>
              </div>
              <Icon n="chevron_right" s={22} c="var(--muted)"/>
            </button>
          ))}
        </div>

        <button onClick={onRegister}
          style={{ width:"100%", background:"none", border:"1px dashed var(--border2)", borderRadius:"var(--rs)", padding:"13px", color:"var(--sub)", fontSize:13, fontWeight:500, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:7, transition:"all .15s" }}
          onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--accent)"; e.currentTarget.style.color="var(--accent)"; e.currentTarget.style.background="var(--abg)"; }}
          onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--border2)"; e.currentTarget.style.color="var(--sub)"; e.currentTarget.style.background="none"; }}>
          <Icon n="person_add" s={18}/>Criar nova conta
        </button>

      </div>
    </div>
  );

  /* ── Email + password form ── */
  const isAdmin = mode === "admin";
  return (
    <div style={{ minHeight:"100dvh", background:"linear-gradient(135deg,#f0eaff 0%,#f5f6f8 60%)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <G/>
      <div className="fu" style={{ width:"100%", maxWidth:380 }}>
        <button onClick={()=>reset(null)}
          style={{ background:"none", border:"none", color:"var(--sub)", cursor:"pointer", display:"flex", alignItems:"center", gap:5, fontSize:13, marginBottom:32, fontWeight:500 }}>
          <Icon n="arrow_back" s={18} c="var(--sub)"/>Voltar
        </button>

        {/* Avatar + title */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ width:64, height:64, borderRadius:"50%", background:isAdmin?"var(--abg)":"var(--bbg)", border:`2px solid ${isAdmin?"var(--abr)":"var(--bbr)"}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
            <Icon n={isAdmin?"admin_panel_settings":"badge"} s={32} c={isAdmin?"var(--accent)":"var(--blue)"}/>
          </div>
          <div style={{ fontFamily:"var(--fh)", fontWeight:600, fontSize:22 }}>
            {isAdmin ? "Acesso de Administrador" : "Acesso da Equipe"}
          </div>
          <div style={{ fontSize:13, color:"var(--sub)", marginTop:5 }}>
            Entre com seu e-mail e senha cadastrados
          </div>
        </div>

        {/* Form */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div>
            <Lbl>E-mail</Lbl>
            <div style={{ position:"relative" }}>
              <Icon n="mail_outline" s={18} c="var(--muted)" style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}/>
              <input value={email} onChange={e=>{ setEmail(e.target.value); setErr(""); }}
                onKeyDown={handleKey}
                placeholder="seu@email.com" type="email" autoComplete="email"
                style={{ width:"100%", background:"var(--bg)", border:"1px solid var(--border2)", borderRadius:"var(--rs)", padding:"11px 12px 11px 40px", color:"var(--text)", fontSize:14, outline:"none" }}
                onFocus={e=>e.target.style.borderColor=isAdmin?"var(--accent)":"var(--blue)"}
                onBlur={e=>e.target.style.borderColor="var(--border2)"}/>
            </div>
          </div>

          <div>
            <Lbl>Senha</Lbl>
            <div style={{ position:"relative" }}>
              <Icon n="lock_outline" s={18} c="var(--muted)" style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}/>
              <input value={password} onChange={e=>{ setPass(e.target.value); setErr(""); }}
                onKeyDown={handleKey}
                placeholder="Sua senha" type={showPass?"text":"password"} autoComplete="current-password"
                style={{ width:"100%", background:"var(--bg)", border:"1px solid var(--border2)", borderRadius:"var(--rs)", padding:"11px 40px 11px 40px", color:"var(--text)", fontSize:14, outline:"none" }}
                onFocus={e=>e.target.style.borderColor=isAdmin?"var(--accent)":"var(--blue)"}
                onBlur={e=>e.target.style.borderColor="var(--border2)"}/>
              <button onClick={()=>setShowP(p=>!p)}
                style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"var(--muted)", display:"flex" }}>
                <Icon n={showPass?"visibility_off":"visibility"} s={18} c="var(--muted)"/>
              </button>
            </div>
          </div>

          {err && (
            <div style={{ background:"var(--rbg)", border:"1px solid var(--rbr)", borderRadius:"var(--rs)", padding:"10px 13px", fontSize:13, color:"var(--red)", display:"flex", alignItems:"center", gap:7, animation:"fadeIn .2s" }}>
              <Icon n="error_outline" s={18} c="var(--red)"/>{err}
            </div>
          )}

          <Btn onClick={submit} dis={loading}
            style={{ width:"100%", justifyContent:"center", padding:"14px", fontSize:15, marginTop:4, background:isAdmin?"var(--accent)":"var(--blue)" }}>
            {loading ? <Icon n="hourglass_top" s={20} c="#fff"/> : <Icon n="login" s={20} c="#fff"/>}
            {loading ? "Verificando..." : "Entrar"}
          </Btn>
        </div>

        <div style={{ textAlign:"center", marginTop:20, fontSize:13, color:"var(--muted)" }}>
          Não tem conta?{" "}
          <button onClick={onRegister} style={{ background:"none", border:"none", color:"var(--accent)", cursor:"pointer", fontSize:13, fontWeight:600 }}>
            Cadastre-se
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══ TEAM VIEW ══════════════════════════════════════════════════════════════
   Full app shell for team members — sidebar nav, Dashboard, Checklists, Alerts
══════════════════════════════════════════════════════════════════════════════*/
const NAV_TEAM_FULL=[
  {id:"dashboard", label:"Painel",     icon:"dashboard"},
  {id:"checklists",label:"Checklists", icon:"checklist"},
  {id:"tasks",     label:"Tarefas",    icon:"task_alt"},
  {id:"alerts",    label:"Alertas",    icon:"notifications"},
];

function TeamView({ user, cls, alerts, tasks, sectors, isLeader, sectorPeers, staff, tpls, onToggle, onEv, onDelEv, onTogEv, onToggleTask, onAddCl, onAddTask, onDelTask, onLogout }) {
  const myCls       = cls.filter(c => c.sid === user.id);
  const myTasks     = tasks.filter(t => t.sid === user.id || t.createdBySid === user.id);
  const adminStaffIds = staff.filter(s=>s.admin).map(s=>s.id);
  const leaderTasks = isLeader ? tasks.filter(t =>
    t.createdBySid === user.id || adminStaffIds.includes(t.createdBySid) || (t.sid === user.id && !t.createdBySid)
  ) : [];
  const myAlerts = alerts.filter(a => a.sid === user.id);
  const unread   = myAlerts.filter(a=>!a.read).length;
  const [page,   setPage]   = useState("dashboard");
  const [openCl, setOpenCl] = useState(null);
  const [showTaskM, setShowTaskM] = useState(false);
  const [showMyTaskM, setShowMyTaskM] = useState(false);
  const [userMenu,    setUserMenu]    = useState(false);

  const NI = ({item}) => {
    const active = page === item.id;
    return (
      <button onClick={()=>setPage(item.id)}
        style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 14px",border:"none",cursor:"pointer",background:active?"var(--abg)":"transparent",color:active?"var(--accent)":"var(--sub)",borderRadius:"var(--rs)",margin:"1px 0",fontWeight:active?600:500,fontSize:14,transition:"all .15s",textAlign:"left",position:"relative"}}>
        <Icon n={item.icon} s={20} c={active?"var(--accent)":"var(--sub)"}/>
        {item.label}
        {item.id==="alerts"&&unread>0&&(
          <span style={{marginLeft:"auto",background:"var(--red)",color:"#fff",borderRadius:100,minWidth:18,height:18,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px"}}>{unread}</span>
        )}
        {item.id==="tasks"&&(isLeader?leaderTasks:myTasks).filter(t=>!t.done).length>0&&(
          <span style={{marginLeft:"auto",background:"var(--warn)",color:"#fff",borderRadius:100,minWidth:18,height:18,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px"}}>{(isLeader?leaderTasks:myTasks).filter(t=>!t.done).length}</span>
        )}
      </button>
    );
  };

  return (
    <>
      <G/>
      <div className="app">
        {/* Mobile top header */}
        <header className="mh">
          <VeroLogo height={20}/>
          <div style={{position:"relative"}}>
            <button onClick={()=>setUserMenu(p=>!p)}
              style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"1px solid var(--border2)",cursor:"pointer",padding:"5px 10px 5px 6px",borderRadius:100}}>
              <Av v={user.av} sz={28} bg={isLeader?"var(--bbg)":"var(--abg)"} co={isLeader?"var(--blue)":"var(--accent)"}/>
              <span style={{fontSize:12,fontWeight:600,color:"var(--text)"}}>{user.name.split(" ")[0]}</span>
              <Icon n={userMenu?"expand_less":"expand_more"} s={16} c="var(--muted)"/>
            </button>
            {userMenu&&(
              <>
                <div onClick={()=>setUserMenu(false)} style={{position:"fixed",inset:0,zIndex:199}}/>
                <div style={{position:"absolute",top:"calc(100% + 8px)",right:0,background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:"var(--rs)",boxShadow:"var(--shm)",minWidth:180,zIndex:200}}>
                  <div style={{padding:"12px 14px",borderBottom:"1px solid var(--border)"}}>
                    <div style={{fontSize:13,fontWeight:600,color:"var(--text)"}}>{user.name}</div>
                    <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{user.email}</div>
                    <div style={{fontSize:11,color:isLeader?"var(--blue)":"var(--accent)",fontWeight:500,marginTop:2}}>{isLeader?"Líder":"Equipe"}</div>
                  </div>
                  <button onClick={()=>{ setUserMenu(false); onLogout(); }}
                    style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"11px 14px",background:"none",border:"none",cursor:"pointer",color:"var(--red)",fontSize:13,fontWeight:600,borderRadius:"0 0 var(--rs) var(--rs)"}}>
                    <Icon n="logout" s={16} c="var(--red)"/>Sair da conta
                  </button>
                </div>
              </>
            )}
          </div>
        </header>
        <div className="bdy">
        {/* Sidebar */}
        <aside className="sb">
          <div style={{padding:"20px 16px 12px"}}>
            <VeroLogo height={22}/>
            <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>Área da Equipe</div>
          </div>
          <Hr/>
          <nav style={{padding:"8px 10px",flex:1}}>
            {NAV_TEAM_FULL.map(it=><NI key={it.id} item={it}/>)}
          </nav>
          <Hr/>
          <div style={{padding:"12px 16px"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <Av v={user.av} sz={32} bg={isLeader?"var(--bbg)":"var(--bbg)"} co={isLeader?"var(--blue)":"var(--blue)"}/>
              <div>
                <div style={{fontSize:13,fontWeight:600,display:"flex",alignItems:"center",gap:5}}>
                  {user.name}
                  {isLeader&&<span style={{fontSize:10,fontWeight:700,color:"var(--blue)",background:"var(--bbg)",borderRadius:100,padding:"1px 6px"}}>LÍDER</span>}
                </div>
                <div style={{fontSize:11,color:"var(--muted)"}}>{user.role}</div>
              </div>
            </div>
            <button onClick={onLogout}
              style={{width:"100%",background:"var(--rbg)",border:"1px solid var(--rbr)",borderRadius:"var(--rs)",padding:"7px 12px",color:"var(--red)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5,fontSize:12,fontWeight:600,transition:"opacity .15s"}}
              onMouseEnter={e=>e.currentTarget.style.opacity=".8"}
              onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
              <Icon n="logout" s={16} c="var(--red)"/>Sair
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="ma">
          {page==="dashboard"  && <TeamDash  user={user} cls={myCls} tasks={myTasks} onOpenCl={setOpenCl} setPage={setPage} onToggleTask={onToggleTask}/>}
          {page==="checklists" && <TeamCls   cls={myCls} onOpenCl={setOpenCl} isLeader={isLeader} sectorPeers={sectorPeers} tpls={tpls} sectors={sectors} onAddCl={onAddCl} onAddTask={onAddTask}/>}
          {page==="tasks"      && isLeader && <LeaderTasks tasks={leaderTasks} staff={staff} sectors={sectors} user={user} onToggleTask={onToggleTask} onAddTask={()=>setShowTaskM(true)} onDelTask={onDelTask}/>}
          {page==="tasks"      && !isLeader && <MyTasks tasks={myTasks} user={user} onToggleTask={onToggleTask} onAddTask={()=>setShowMyTaskM(true)} onDelTask={(id)=>{if(window.confirm("Deletar esta tarefa?"))onDelTask&&onDelTask(id);}}/>}
          {page==="alerts"     && <TeamAlerts alerts={myAlerts}/>}
        </div>

        {/* Mobile bottom nav */}
        <nav className="bn">
          {NAV_TEAM_FULL.map(it=>(
            <button key={it.id} onClick={()=>setPage(it.id)}
              style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,background:"none",border:"none",cursor:"pointer",padding:"6px 10px",color:page===it.id?"var(--accent)":"var(--muted)",position:"relative",minWidth:48}}>
              <Icon n={it.icon} s={22} c={page===it.id?"var(--accent)":"var(--muted)"}/>
              <span style={{fontSize:10,fontWeight:page===it.id?600:400}}>{it.label}</span>
              {it.id==="alerts"&&unread>0&&(
                <span style={{position:"absolute",top:3,right:4,background:"var(--red)",color:"#fff",borderRadius:100,width:15,height:15,fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{unread}</span>
              )}
            </button>
          ))}
            <button onClick={onLogout}
              style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,background:"none",border:"none",cursor:"pointer",padding:"6px 10px",color:"var(--red)",position:"relative",minWidth:48}}>
              <Icon n="logout" s={22} c="var(--red)"/>
              <span style={{fontSize:10,fontWeight:400}}>Sair</span>
            </button>
        </nav>
        </div>
      </div>

      {openCl && (
        <TeamClDetail cl={openCl} onClose={()=>setOpenCl(null)}
          onToggle={id=>{ onToggle(openCl.id,id); setOpenCl(p=>({...p,items:p.items.map(i=>i.id===id?{...i,done:!i.done}:i)})); }}
          onEv={(id,ev)=>{ onEv(openCl.id,id,ev); setOpenCl(p=>({...p,items:p.items.map(i=>i.id===id?{...i,ev:"set",et:ev.text||"",img:ev.img||null}:i)})); }}
          onDelEv={id=>{ onDelEv(openCl.id,id); setOpenCl(p=>({...p,items:p.items.map(i=>i.id===id?{...i,ev:null,et:"",img:null,eo:false}:i)})); }}
          onTogEv={id=>{ onTogEv(openCl.id,id); setOpenCl(p=>({...p,items:p.items.map(i=>i.id===id?{...i,eo:!i.eo}:i)})); }}
        />
      )}
      {showTaskM && isLeader && <AddTaskModal staff={sectorPeers} onClose={()=>setShowTaskM(false)} onAdd={(task)=>{onAddTask({...task,createdBySid:user.id});setShowTaskM(false);}}/> }
      {showMyTaskM && !isLeader && <AddTaskModal staff={[user]} onClose={()=>setShowMyTaskM(false)} onAdd={(task)=>{onAddTask&&onAddTask({...task,sid:user.id,createdBySid:user.id});setShowMyTaskM(false);}}/>}
    </>
  );
}

/* ── Team Dashboard ─────────────────────────────────────────────────────── */
function TeamDash({ user, cls, tasks, onOpenCl, setPage, onToggleTask }) {
  const done  = cls.filter(c=>c.st==="done").length;
  const total = cls.length;
  const alerts_count = cls.filter(c=>c.st==="alert").length;
  const pct_overall  = total ? Math.round(done/total*100) : 0;

  return (
    <div className="pp fu">
      {/* Header */}
      <div style={{marginBottom:22}}>
        <h1 style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:24}}>
          Olá, {user.firstName||user.name.split(" ")[0]}! 👋
        </h1>
        <p style={{fontSize:13,color:"var(--sub)",marginTop:3}}>
          {total===0 ? "Nenhuma tarefa atribuída a você." : done===total&&total>0 ? "Todas as tarefas concluídas! Ótimo trabalho. 🎉" : `${done} de ${total} checklists concluídos hoje`}
        </p>
      </div>

      {/* Stat cards */}
      <div className="g4" style={{display:"grid",gap:14,marginBottom:22}}>
        {[
          {label:"Checklists",val:total,       icon:"checklist",    c:"var(--accent)", bg:"var(--abg)"},
          {label:"Concluídos",val:done,         icon:"check_circle", c:"var(--accent)", bg:"var(--abg)"},
          {label:"Tarefas",   val:tasks.filter(t=>!t.done).length, icon:"task_alt", c:"var(--blue)", bg:"var(--bbg)"},
          {label:"Alertas",   val:alerts_count, icon:"warning",      c:"var(--red)",    bg:"var(--rbg)"},
        ].map(({label,val,icon,c,bg})=>(
          <Card key={label} style={{padding:"16px 18px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
              <div style={{fontSize:12,color:"var(--sub)",fontWeight:500}}>{label}</div>
              <div style={{width:32,height:32,borderRadius:"var(--rs)",background:bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Icon n={icon} s={18} c={c}/>
              </div>
            </div>
            <div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:26,color:"var(--text)"}}>{val}</div>
          </Card>
        ))}
      </div>

      {/* Overall progress */}
      {total>0&&(
        <Card style={{padding:"16px 18px",marginBottom:22}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"var(--sub)",marginBottom:8}}>
            <span style={{fontWeight:600,display:"flex",alignItems:"center",gap:5}}><Icon n="trending_up" s={16} c="var(--accent)"/>Progresso Geral</span>
            <span style={{fontFamily:"var(--fh)",fontWeight:700,color:"var(--accent)",fontSize:14}}>{pct_overall}%</span>
          </div>
          <Bar v={pct_overall} h={8}/>
        </Card>
      )}

      {/* My checklists preview */}
      {total>0&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:16}}>Minhas Tarefas</div>
            <button onClick={()=>setPage("checklists")} style={{background:"none",border:"none",color:"var(--accent)",cursor:"pointer",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:3}}>
              Ver todas<Icon n="arrow_forward_ios" s={12} c="var(--accent)"/>
            </button>
          </div>
          {cls.slice(0,3).map((c,i)=>{
            const p=pct(c.items);
            return(
              <div key={c.id} onClick={()=>onOpenCl(c)}
                style={{background:"var(--surface)",border:`1.5px solid ${c.st==="alert"?"var(--rbr)":c.st==="done"?"var(--abr)":"var(--border)"}`,borderRadius:"var(--r)",padding:"14px",marginBottom:10,cursor:"pointer",transition:"all .18s",boxShadow:"var(--sh)",animation:`fadeUp ${.1+i*.06}s ease`}}
                onMouseEnter={e=>e.currentTarget.style.boxShadow="var(--shm)"}
                onMouseLeave={e=>e.currentTarget.style.boxShadow="var(--sh)"}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <span style={{fontSize:22}}>{c.icon}</span>
                    <div>
                      <div style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:14}}>{c.name}</div>
                      <div style={{fontSize:11,color:"var(--muted)",marginTop:1,display:"flex",alignItems:"center",gap:3}}>
                        <Icon n="schedule" s={12} c="var(--muted)"/>{c.due}
                        {c.freq&&<span style={{marginLeft:4,color:"var(--accent)",fontWeight:500}}>· {FREQ_LABEL(c.freq,c.days||[])}</span>}
                      </div>
                    </div>
                  </div>
                  <SPill s={c.st}/>
                </div>
                <Bar v={p} h={5}/>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:11,color:"var(--sub)"}}>
                  <span><Icon n="check_circle_outline" s={13} c="var(--sub)"/>{c.items.filter(i=>i.done).length}/{c.items.length} itens</span>
                  <span style={{fontFamily:"var(--fh)",fontWeight:700,color:p===100?"var(--accent)":"var(--text)"}}>{p}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {total===0&&(
        <div style={{textAlign:"center",padding:"40px 20px"}}>
          <Icon n="inbox" s={52} c="var(--border2)"/>
          <div style={{marginTop:16,fontSize:16,fontWeight:500,color:"var(--sub)"}}>Nenhum checklist atribuído</div>
          <div style={{fontSize:13,marginTop:6,color:"var(--muted)"}}>Fale com o administrador para atribuir tarefas.</div>
        </div>
      )}

      {/* Pending tasks preview */}
      {tasks.filter(t=>!t.done).length>0&&(
        <div style={{marginTop:8}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:16,display:"flex",alignItems:"center",gap:6}}>
              <Icon n="task_alt" s={18} c="var(--blue)"/>Tarefas Pendentes
              <span style={{fontSize:12,fontWeight:400,color:"var(--sub)",marginLeft:2}}>{tasks.filter(t=>!t.done).length}</span>
            </div>
            <button onClick={()=>setPage("checklists")} style={{background:"none",border:"none",color:"var(--accent)",cursor:"pointer",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:3}}>
              Ver todas<Icon n="arrow_forward_ios" s={12} c="var(--accent)"/>
            </button>
          </div>
          {tasks.filter(t=>!t.done).slice(0,3).map((t,i)=>{
            const PRIO={high:{c:"var(--red)",bg:"var(--rbg)",label:"Alta"},medium:{c:"var(--warn)",bg:"var(--wbg)",label:"Média"},low:{c:"var(--accent)",bg:"var(--abg)",label:"Baixa"}};
            const pr=PRIO[t.priority]||PRIO.medium;
            return(
              <div key={t.id} style={{background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:"var(--rs)",padding:"12px 14px",marginBottom:8,display:"flex",alignItems:"flex-start",gap:10,animation:`fadeUp ${.1+i*.05}s ease`}}>
                <div onClick={()=>onToggleTask(t.id)} style={{width:20,height:20,borderRadius:5,flexShrink:0,cursor:"pointer",background:"var(--surface)",border:"2px solid var(--border2)",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s",marginTop:2}}>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:13,marginBottom:2}}>{t.title}</div>
                  <div style={{display:"flex",alignItems:"center",gap:8,fontSize:11}}>
                    <span style={{color:pr.c,background:pr.bg,borderRadius:100,padding:"1px 7px",fontWeight:600}}>{pr.label}</span>
                    {t.dueDate&&<span style={{color:"var(--muted)",display:"flex",alignItems:"center",gap:3}}><Icon n="event" s={12} c="var(--muted)"/>{t.dueDate}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Team Checklists page ───────────────────────────────────────────────── */
function TeamCls({ cls, onOpenCl, isLeader, sectorPeers, tpls, sectors, onAddCl, onAddTask }) {
  const [showAddCl,   setShowAddCl]  = useState(false);
  const [filter,setFilter] = useState("all");
  const FILTERS=[{id:"all",l:"Todos"},{id:"alert",l:"Alertas"},{id:"in_progress",l:"Em andamento"},{id:"done",l:"Concluídos"},{id:"pending",l:"Pendentes"}];
  const list = filter==="all" ? cls : cls.filter(c=>c.st===filter);
  return (
    <>
    <div className="pp fu">
      {/* ── Checklists ── */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
        <div>
          <h1 style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:22}}>{isLeader?"Checklists do Setor":"Meus Checklists"}</h1>
          <p style={{fontSize:13,color:"var(--sub)",marginTop:3}}>{isLeader?`${cls.length} no setor`:`${cls.length} atribuídos a você`}</p>
        </div>
        {isLeader&&(
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={()=>setShowAddCl(true)}><Icon n="add" s={18}/>Checklist</Btn>
          </div>
        )}
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:18}}>
        {FILTERS.map(f=>(
          <button key={f.id} onClick={()=>setFilter(f.id)}
            style={{padding:"5px 13px",borderRadius:100,border:filter===f.id?"1px solid var(--accent)":"1px solid var(--border2)",background:filter===f.id?"var(--abg)":"transparent",color:filter===f.id?"var(--accent)":"var(--sub)",fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .15s"}}>
            {f.l}
          </button>
        ))}
      </div>
      {list.length===0?(
        <div style={{textAlign:"center",padding:"40px 20px",marginBottom:24,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r)"}}>
          <Icon n="search_off" s={40} c="var(--border2)"/>
          <div style={{marginTop:10,color:"var(--muted)",fontSize:14}}>Nenhum checklist neste filtro.</div>
        </div>
      ):(
        <div style={{marginBottom:32}}>
          {list.map((cl,i)=>{
            const p=pct(cl.items);
            return(
              <div key={cl.id} onClick={()=>onOpenCl(cl)}
                style={{background:"var(--surface)",border:`1.5px solid ${cl.st==="alert"?"var(--rbr)":cl.st==="done"?"var(--abr)":"var(--border)"}`,borderRadius:"var(--r)",padding:"16px",marginBottom:12,cursor:"pointer",transition:"all .18s",boxShadow:"var(--sh)",animation:`fadeUp ${.1+i*.04}s ease`}}
                onMouseEnter={e=>e.currentTarget.style.boxShadow="var(--shm)"}
                onMouseLeave={e=>e.currentTarget.style.boxShadow="var(--sh)"}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <span style={{fontSize:24}}>{cl.icon}</span>
                    <div>
                      <div style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:15}}>{cl.name}</div>
                      <div style={{fontSize:11,color:"var(--muted)",marginTop:2,display:"flex",alignItems:"center",gap:3}}>
                        <Icon n="schedule" s={12} c="var(--muted)"/>{cl.due}
                        {cl.freq&&<span style={{marginLeft:4,color:"var(--accent)",fontWeight:500}}>· {FREQ_LABEL(cl.freq,cl.days||[])}</span>}
                      </div>
                    </div>
                  </div>
                  <SPill s={cl.st}/>
                </div>
                <Bar v={p} h={6}/>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:10,fontSize:12,color:"var(--sub)"}}>
                  <span style={{display:"flex",alignItems:"center",gap:3}}><Icon n="check_circle_outline" s={14} c="var(--sub)"/>{cl.items.filter(i=>i.done).length}/{cl.items.length} itens</span>
                  <span style={{fontFamily:"var(--fh)",fontWeight:700,color:p===100?"var(--accent)":"var(--text)"}}>{p}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
    {/* Leader modals */}
    {showAddCl && isLeader && <AddCl staff={sectorPeers||[]} tpls={tpls||[]} onClose={()=>setShowAddCl(false)} onAdd={(tid,sid,freq,days,due)=>{if(onAddCl){onAddCl(tid,sid,freq,days,due);}setShowAddCl(false);}}/>}
    </>
  );
}

/* ── Team Alerts page ───────────────────────────────────────────────────── */
function TeamAlerts({ alerts }) {
  const TC2={danger:"var(--red)",warning:"var(--warn)",success:"var(--accent)",info:"var(--blue)"};
  const TB2={danger:"var(--rbg)",warning:"var(--wbg)",success:"var(--gbg)",info:"var(--bbg)"};
  const TBR2={danger:"var(--rbr)",warning:"var(--wbr)",success:"var(--gbr)",info:"var(--bbr)"};
  const TI2={danger:"error_outline",warning:"warning_amber",success:"check_circle_outline",info:"info"};
  return (
    <div className="pp fu">
      <div style={{marginBottom:18}}>
        <h1 style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:22}}>Alertas</h1>
        <p style={{fontSize:13,color:"var(--sub)",marginTop:3}}>{alerts.filter(a=>!a.read).length} não lidos</p>
      </div>
      {alerts.length===0?(
        <div style={{textAlign:"center",padding:"60px 20px"}}>
          <Icon n="notifications_none" s={52} c="var(--border2)"/>
          <div style={{marginTop:12,color:"var(--muted)",fontSize:14}}>Nenhum alerta.</div>
        </div>
      ):alerts.map((al,i)=>(
        <div key={al.id} style={{background:al.read?"var(--surface)":TB2[al.type],border:`1px solid ${al.read?"var(--border)":TBR2[al.type]}`,borderRadius:"var(--rs)",padding:"14px 16px",marginBottom:10,display:"flex",gap:12,alignItems:"flex-start",opacity:al.read?.7:1,animation:`fadeUp ${.1+i*.03}s ease`}}>
          <Icon n={TI2[al.type]} s={20} c={TC2[al.type]}/>
          <div style={{flex:1}}>
            <div style={{fontWeight:600,fontSize:13,color:"var(--text)",marginBottom:3}}>{al.title}</div>
            <div style={{fontSize:12,color:"var(--sub)",lineHeight:1.5}}>{al.body}</div>
            <div style={{fontSize:11,color:"var(--muted)",marginTop:6}}>{al.time}</div>
          </div>
          {!al.read&&<div style={{width:8,height:8,borderRadius:"50%",background:TC2[al.type],flexShrink:0,marginTop:4}}/>}
        </div>
      ))}
    </div>
  );
}

/* ─── TEAM CHECKLIST DETAIL (with photo evidence) ───────────────────────── */
function TeamClDetail({ cl, onClose, onToggle, onEv, onDelEv, onTogEv }) {
  const [evFor, setEvFor]   = useState(null);  // item.id being evidenced
  const [evText,setEvText]  = useState("");
  const [evImg, setEvImg]   = useState(null);  // base64 string
  const [evMode,setEvMode]  = useState("text"); // "text"|"photo"
  const p = pct(cl.items);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => setEvImg(ev.target.result);
    reader.readAsDataURL(file);
  };

  const submitEv = (itemId) => {
    if(evMode==="photo" && !evImg) return;
    if(evMode==="text"  && !evText.trim()) return;
    onEv(itemId, { text: evText, img: evImg });
    setEvFor(null); setEvText(""); setEvImg(null); setEvMode("text");
  };

  return (
    <Ov onClick={onClose}>
      <Sheet onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <span style={{fontSize:28}}>{cl.icon}</span>
            <div>
              <div style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:17}}>{cl.name}</div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4,flexWrap:"wrap"}}>
                <SPill s={cl.st}/>
                <span style={{fontSize:11,color:"var(--muted)",display:"flex",alignItems:"center",gap:3}}>
                  <Icon n="schedule" s={12} c="var(--muted)"/>{cl.due}
                </span>
                {cl.freq&&<span style={{fontSize:11,color:"var(--accent)",fontWeight:500,display:"flex",alignItems:"center",gap:3}}>
                  <Icon n="autorenew" s={12} c="var(--accent)"/>{FREQ_LABEL(cl.freq,cl.days||[])}
                </span>}
              </div>
            </div>
          </div>
          <Btn v="g" sz="s" onClick={onClose} style={{padding:4}}><Icon n="close" s={20}/></Btn>
        </div>

        <div style={{marginBottom:18}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"var(--sub)",marginBottom:5}}>
            <span>{cl.items.filter(i=>i.done).length} de {cl.items.length} itens</span>
            <span style={{fontWeight:600,color:"var(--text)"}}>{p}%</span>
          </div>
          <Bar v={p} h={6}/>
        </div>
        <Hr/>

        <div style={{marginTop:14,display:"flex",flexDirection:"column",gap:8}}>
          {cl.items.map((item,idx)=>(
            <div key={item.id}>
              {/* Item row */}
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:item.done?"var(--abg)":item.crit?"var(--rbg)":"var(--bg)",border:`1px solid ${item.done?"var(--abr)":item.crit?"var(--rbr)":"var(--border)"}`,borderRadius:item.ev&&item.eo?"var(--rs) var(--rs) 0 0":"var(--rs)",animation:`fadeUp ${.08+idx*.02}s ease`}}>
                <div onClick={()=>onToggle(item.id)} style={{width:22,height:22,borderRadius:6,flexShrink:0,cursor:"pointer",background:item.done?"var(--accent)":"var(--surface)",border:`2px solid ${item.done?"var(--accent)":item.crit?"var(--red)":"var(--border2)"}`,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"}}>
                  {item.done&&<Icon n="check" s={14} c="#fff"/>}
                </div>
                <span style={{flex:1,fontSize:13,textDecoration:item.done?"line-through":"none",color:item.done?"var(--muted)":"var(--text)",lineHeight:1.45,display:"flex",alignItems:"center",gap:4}}>
                  {item.crit&&!item.done&&<Icon n="warning_amber" s={15} c="var(--red)"/>}{item.t}
                </span>
                {item.ev ? (
                  <button onClick={()=>onTogEv(item.id)} style={{background:"var(--abg)",border:"1px solid var(--abr)",borderRadius:5,padding:"4px 8px",color:"var(--accent)",cursor:"pointer",display:"flex",alignItems:"center",gap:3,fontSize:12,fontWeight:600}}>
                    <Icon n="attach_file" s={18} c="var(--accent)"/>
                    <Icon n={item.eo?"expand_less":"expand_more"} s={18} c="var(--accent)"/>
                  </button>
                ) : (
                  <Btn sz="s" v="g" onClick={()=>{ setEvFor(evFor===item.id?null:item.id); setEvText(""); setEvImg(null); setEvMode("text"); }}>
                    <Icon n="attach_file" s={18}/>
                  </Btn>
                )}
              </div>

              {/* Evidence entry panel */}
              {evFor===item.id&&!item.ev&&(
                <div style={{background:"var(--bg)",border:"1px solid var(--border2)",borderTop:"none",borderRadius:"0 0 var(--rs) var(--rs)",padding:"12px 14px"}}>
                  {/* Mode toggle */}
                  <div style={{display:"flex",gap:6,marginBottom:10}}>
                    {[["text","notes","Texto"],["photo","photo_camera","Foto"]].map(([m,ic,lbl])=>(
                      <button key={m} onClick={()=>{setEvMode(m);setEvImg(null);setEvText("");}}
                        style={{flex:1,padding:"7px",borderRadius:"var(--rs)",border:evMode===m?"1.5px solid var(--accent)":"1.5px solid var(--border2)",background:evMode===m?"var(--abg)":"transparent",color:evMode===m?"var(--accent)":"var(--sub)",fontWeight:600,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5,transition:"all .15s"}}>
                        <Icon n={ic} s={16} c={evMode===m?"var(--accent)":"var(--sub)"}/>
                        {lbl}
                      </button>
                    ))}
                  </div>

                  {evMode==="text" ? (
                    <div style={{display:"flex",gap:6}}>
                      <Inp val={evText} onChange={e=>setEvText(e.target.value)} ph="Descreva a evidência..."/>
                      <Btn onClick={()=>submitEv(item.id)} dis={!evText.trim()}><Icon n="check" s={18}/></Btn>
                      <Btn v="o" onClick={()=>setEvFor(null)}><Icon n="close" s={18}/></Btn>
                    </div>
                  ) : (
                    <div>
                      <label style={{display:"block",cursor:"pointer"}}>
                        <div style={{border:"2px dashed var(--border2)",borderRadius:"var(--rs)",padding:"20px",textAlign:"center",background:evImg?"var(--abg)":"transparent",transition:"all .2s"}}
                          onDragOver={e=>{e.preventDefault();e.currentTarget.style.borderColor="var(--accent)";}}
                          onDragLeave={e=>e.currentTarget.style.borderColor="var(--border2)"}
                          onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f){const r=new FileReader();r.onload=ev=>setEvImg(ev.target.result);r.readAsDataURL(f);}e.currentTarget.style.borderColor="var(--border2)";}}>
                          {evImg ? (
                            <img src={evImg} alt="preview" style={{maxWidth:"100%",maxHeight:180,borderRadius:"var(--rs)",objectFit:"cover"}}/>
                          ) : (
                            <>
                              <Icon n="add_photo_alternate" s={36} c="var(--muted)"/>
                              <div style={{fontSize:13,color:"var(--sub)",marginTop:8,fontWeight:500}}>Clique para selecionar ou arraste uma foto</div>
                              <div style={{fontSize:11,color:"var(--muted)",marginTop:3}}>JPG, PNG, WEBP</div>
                            </>
                          )}
                        </div>
                        <input type="file" accept="image/*" onChange={handleFile} style={{display:"none"}}/>
                      </label>
                      {evImg&&(
                        <div style={{display:"flex",gap:6,marginTop:8}}>
                          <Inp val={evText} onChange={e=>setEvText(e.target.value)} ph="Legenda opcional..."/>
                          <Btn onClick={()=>submitEv(item.id)}><Icon n="check" s={18}/></Btn>
                          <Btn v="o" onClick={()=>{setEvImg(null);}}><Icon n="delete_outline" s={18}/></Btn>
                        </div>
                      )}
                      {!evImg&&(
                        <div style={{display:"flex",justifyContent:"flex-end",marginTop:8}}>
                          <Btn v="o" onClick={()=>setEvFor(null)}><Icon n="close" s={18}/>Cancelar</Btn>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Evidence display */}
              {item.ev&&item.eo&&(
                <div style={{background:"var(--abg)",border:"1px solid var(--abr)",borderTop:"none",borderRadius:"0 0 var(--rs) var(--rs)",padding:"12px 14px",animation:"fadeUp .18s ease"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:10,color:"var(--accent)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6}}>Evidência</div>
                      {item.img&&(
                        <img src={item.img} alt="evidence" style={{width:"100%",maxHeight:200,objectFit:"cover",borderRadius:"var(--rs)",marginBottom:6}}/>
                      )}
                      {item.et&&<div style={{fontSize:13,color:"var(--text)",lineHeight:1.5}}>{item.et}</div>}
                      {!item.img&&!item.et&&<div style={{fontSize:13,color:"var(--muted)"}}>Evidência registrada.</div>}
                    </div>
                    <Btn sz="s" v="d" onClick={()=>onDelEv(item.id)}><Icon n="delete_outline" s={18}/></Btn>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Sheet>
    </Ov>
  );
}


/* ═══ PENDING APPROVALS MODAL ════════════════════════════════════════════════
   Admin reviews pending registrations. On approve/reject a simulated
   email notification is shown to confirm the action.
══════════════════════════════════════════════════════════════════════════════*/
function PendingModal({ pending, onApprove, onReject, onClose }) {
  const [sent, setSent] = useState({}); // { userId: "approved"|"rejected" }

  const doAction = (user, type) => {
    setSent(p => ({ ...p, [user.id]: type }));
    setTimeout(() => {
      if (type === "approved") onApprove(user);
      else onReject(user);
    }, 1000);
  };

  return (
    <Ov onClick={onClose}>
      <Sheet onClick={e=>e.stopPropagation()} style={{ maxWidth:520 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
          <div style={{ fontFamily:"var(--fh)", fontWeight:600, fontSize:19, display:"flex", alignItems:"center", gap:9 }}>
            <Icon n="how_to_reg" s={22} c="var(--accent)"/>Aprovações Pendentes
          </div>
          <Btn v="g" sz="s" onClick={onClose} style={{padding:4}}><Icon n="close" s={20}/></Btn>
        </div>
        <div style={{ fontSize:13, color:"var(--sub)", marginBottom:22 }}>
          {pending.length} cadastro{pending.length!==1?"s":""} aguardando revisão
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {pending.map(user => {
            const s = sent[user.id];
            return (
              <div key={user.id} style={{ background:"var(--bg)", border:"1px solid var(--border2)", borderRadius:"var(--rs)", padding:"16px", transition:"all .3s" }}>
                {/* User info */}
                <div style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:14 }}>
                  <Av v={user.av} sz={44} bg="var(--surface)" co="#4b5563"/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"var(--fh)", fontWeight:600, fontSize:15, marginBottom:6 }}>{user.name}</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                      <span style={{ fontSize:12, color:"var(--sub)", display:"flex", alignItems:"center", gap:5 }}>
                        <Icon n="mail_outline" s={14} c="var(--muted)"/>{user.email}
                      </span>
                      <span style={{ fontSize:12, color:"var(--sub)", display:"flex", alignItems:"center", gap:5 }}>
                        <Icon n="phone_iphone" s={14} c="var(--muted)"/>{user.phone}
                      </span>
                      <span style={{ fontSize:12, color:"var(--sub)", display:"flex", alignItems:"center", gap:5 }}>
                        <Icon n="badge" s={14} c="var(--muted)"/>Função: {user.role}
                      </span>
                    </div>
                  </div>
                  <Pill ch="Pendente" c="var(--warn)" b="var(--wbg)" br="var(--wbr)"/>
                </div>

                {/* Action area */}
                {!s ? (
                  <div style={{ display:"flex", gap:10 }}>
                    <Btn v="d" onClick={()=>doAction(user,"rejected")} style={{ flex:1, justifyContent:"center" }}>
                      <Icon n="cancel" s={20}/>Reprovar
                    </Btn>
                    <Btn v="p" onClick={()=>doAction(user,"approved")} style={{ flex:1, justifyContent:"center" }}>
                      <Icon n="check_circle" s={20}/>Aprovar
                    </Btn>
                  </div>
                ) : (
                  <div style={{ background:s==="approved"?"var(--abg)":"var(--rbg)", border:`1px solid ${s==="approved"?"var(--abr)":"var(--rbr)"}`, borderRadius:"var(--rs)", padding:"11px 14px", display:"flex", alignItems:"center", gap:8, fontSize:13, color:s==="approved"?"var(--accent)":"var(--red)", fontWeight:500 }}>
                    <Icon n="mark_email_read" s={20} c={s==="approved"?"var(--accent)":"var(--red)"}/>
                    <div>
                      <div style={{ fontWeight:600 }}>
                        {s==="approved" ? "Cadastro aprovado!" : "Cadastro reprovado."}
                      </div>
                      <div style={{ fontSize:12, opacity:.8, marginTop:2 }}>
                        E-mail {s==="approved"?"de boas-vindas":"de reprovação"} enviado para {user.email}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {pending.length === 0 && (
          <div style={{ textAlign:"center", padding:"30px 0", color:"var(--muted)" }}>
            <Icon n="done_all" s={40} c="var(--abr)"/>
            <div style={{ marginTop:10, fontSize:14 }}>Todos os cadastros foram revisados.</div>
          </div>
        )}
      </Sheet>
    </Ov>
  );
}

/* ═══ ROOT APP ═══════════════════════════════════════════════════════════════*/
export default function App() {
  const [screen,  setScreen]  = useState("login"); // "login"|"register"
  const [session, setSession] = useState(() => {
    try {
      const saved = sessionStorage.getItem("vero_session");
      if (!saved) return null;
      const { data, ts } = JSON.parse(saved);
      if (Date.now() - ts < 10 * 60 * 1000) return data; // 10 min
      sessionStorage.removeItem("vero_session");
    } catch {}
    return null;
  });
  const [staff,   setStaff]   = useState([]);
  const [page,    setPage]    = useState("dashboard");
  const [tpls,    setTpls]    = useState([]);
  const [cls,     setCls]     = useState([]);
  const [alerts,  setAlerts]  = useState([]);
  const [openCl,  setOpenCl]  = useState(null);
  const [addClM,  setAddClM]  = useState(null);
  const [newTplM, setNewTplM] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [hlCl,    setHlCl]    = useState(null);
  const [pendingModal, setPendingModal] = useState(false);
  const [tasks,   setTasks]   = useState([]);
  const [addTaskM,setAddTaskM]= useState(false);
  const [sectors, setSectors] = useState([]);
  const [editMemberM, setEditMemberM] = useState(null); // member object being edited
  const [userMenu,    setUserMenu]    = useState(false);
  const [sectorsM,    setSectorsM]    = useState(false);
  const [loading,     setLoading]     = useState(true);
  const [dbError,     setDbError]     = useState(null);

  const unread     = alerts.filter(a=>!a.read).length;
  const pending    = staff.filter(s=>s.status==="pending");
  const hasPending = pending.length > 0;

  /* ── Refresh session timestamp on activity (keep alive up to 10 min) ── */
  useEffect(() => {
    if (!session) return;
    const refresh = () => {
      try {
        const saved = sessionStorage.getItem("vero_session");
        if (saved) {
          sessionStorage.setItem("vero_session", JSON.stringify({data:session, ts:Date.now()}));
        }
      } catch {}
    };
    // Refresh on any click or keydown
    window.addEventListener("click", refresh);
    window.addEventListener("keydown", refresh);
    // Also refresh every 2 min via interval
    const iv = setInterval(refresh, 2 * 60 * 1000);
    return () => { window.removeEventListener("click", refresh); window.removeEventListener("keydown", refresh); clearInterval(iv); };
  }, [session]);

  /* ── Load all data from Supabase on mount ── */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [staffRes, clsRes, tplsRes, alertsRes, sectorsRes, tasksRes] = await Promise.all([
          db.getStaff(), db.getChecklists(), db.getTemplates(),
          db.getAlerts(), db.getSectors(), db.getTasks(),
        ]);

        if (staffRes.error)   throw staffRes.error;
        if (clsRes.error)     throw clsRes.error;
        if (tplsRes.error)    throw tplsRes.error;
        if (alertsRes.error)  throw alertsRes.error;
        if (sectorsRes.error) throw sectorsRes.error;
        if (tasksRes.error)   throw tasksRes.error;
        setStaff(   staffRes.data.map(fromDbStaff));
        setCls(     clsRes.data.map(fromDbChecklist));
        setTpls(    tplsRes.data.map(fromDbTemplate));
        setAlerts(  alertsRes.data.map(fromDbAlert));
        setSectors( sectorsRes.data.map(fromDbSector));
        setTasks(   tasksRes.data.map(fromDbTask));
      } catch (e) {
        console.error('DB load error:', e);
        setDbError(e.message || 'Erro ao conectar com o banco de dados.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []); // eslint-disable-line

  /* ── Schedule engine: checks every 60s for resets + overdue ── */

  useEffect(()=>{
    const checkSchedule = () => {
      const now      = new Date();
      const todayStr = now.toDateString();
      const nowMins  = now.getHours()*60 + now.getMinutes();
      const newAlerts = []; // collect alerts to emit outside setCls

      setCls(prev => {
        let anyChange = false;
        const next = prev.map(cl => {
          if(!cl.freq) return cl;

          /* ── 1. Should this checklist reset today? ── */
          const lastReset = new Date(cl.lastReset||"2000-01-01");
          const daysSince = Math.floor((now - lastReset) / 86400000);
          let shouldReset = false;

          if(cl.freq==="daily")       shouldReset = todayStr !== cl.lastReset;
          if(cl.freq==="twice_week")  shouldReset = daysSince>=1 && (cl.days||[]).includes(now.getDay()) && todayStr!==cl.lastReset;
          if(cl.freq==="three_week")  shouldReset = daysSince>=1 && (cl.days||[]).includes(now.getDay()) && todayStr!==cl.lastReset;
          if(cl.freq==="weekly")      shouldReset = daysSince>=6 && (cl.days||[]).includes(now.getDay()) && todayStr!==cl.lastReset;
          if(cl.freq==="monthly")     shouldReset = daysSince>=28 && (cl.days||[]).includes(now.getDay()) && todayStr!==cl.lastReset;
          if(cl.freq==="yearly")      shouldReset = daysSince>=364 && todayStr!==cl.lastReset;

          if(shouldReset){
            anyChange = true;
            newAlerts.push({
              id:"rst"+Date.now()+cl.id, type:"info",
              title:`Checklist reiniciado: ${cl.name}`,
              body:`${cl.name} foi reiniciado (${FREQ_LABEL(cl.freq,cl.days||[])}). Confira seus itens.`,
              time:"agora", read:false, link:{page:"checklists",cid:cl.id}, sid:cl.sid
            });
            return{...cl, st:"pending", lastReset:todayStr, overdueAlertSent:false,
              items:cl.items.map(i=>({...i,done:false,ev:null,et:"",eo:false}))};
          }

          /* ── 2. Overdue check ── */
          if(cl.dueTime && !cl.overdueAlertSent && cl.st!=="done" && todayStr===cl.lastReset){
            const [dh,dm] = cl.dueTime.split(":").map(Number);
            if(nowMins >= dh*60+dm){
              anyChange = true;
              newAlerts.push({
                id:"ov"+Date.now()+cl.id, type:"danger",
                title:`Checklist em atraso: ${cl.name}`,
                body:`Prazo das ${cl.dueTime} passou sem conclusao. Administradores notificados por e-mail.`,
                time:"agora", read:false, link:{page:"checklists",cid:cl.id}, sid:cl.sid, forAdmins:true
              });
              return{...cl, st:"alert", overdueAlertSent:true};
            }
          }
          return cl;
        });
        return anyChange ? next : prev;
      });

      // Emit alerts outside setCls updater (safe pattern)
      if(newAlerts.length > 0){
        setAlerts(prev => [...newAlerts, ...prev]);
      }
    };

    checkSchedule();
    const timer = setInterval(checkSchedule, 60000);
    return ()=>clearInterval(timer);
  }, []); // eslint-disable-line

  /* ── Registration ── */
  const handleRegistered = (user) => {
    setStaff(p => [...p, user]);
    const al = !user.admin ? {
      id:"ar"+Date.now(), type:"warning",
      title:"Novo cadastro aguardando aprovação",
      body:`${user.name} (${user.role}) solicitou acesso ao sistema.`,
      time:"agora", read:false, link:{ page:"dashboard", action:"pending" }
    } : null;
    if (al) setAlerts(p => [al, ...p]);
    setScreen("login");
    (async()=>{const r=await db.upsertStaff(user);if(r?.error)console.error(r.error)})();
    if (al) (async()=>{const r=await db.upsertAlert(al);if(r?.error)console.error(r.error)})();
  };

  /* ── Approval / rejection ── */
  const updateMember = (updated) => {
    let final;
    setStaff(p => p.map(s => s.id===updated.id ? (final={...s,...updated, password:s.password}) : s));
    setEditMemberM(null);
    setTimeout(()=>{ if(final) (async()=>{const r=await db.upsertStaff(final);if(r?.error)console.error(r.error)})(); }, 0);
  };
  const approveMember = (user) => {
    const upd={...user, status:"approved"};
    setStaff(p => p.map(s => s.id===user.id ? upd : s));
    const al={id:"aa"+Date.now(), type:"success", title:"Cadastro aprovado",
      body:`${user.name} foi aprovado e já pode fazer login.`,
      time:"agora", read:false, link:{ page:"staff" }};
    setAlerts(p => [al, ...p]);
    (async()=>{const r=await db.upsertStaff(upd);if(r?.error)console.error(r.error)})();
    (async()=>{const r=await db.upsertAlert(al);if(r?.error)console.error(r.error)})();
  };
  const rejectMember = (user) => {
    setStaff(p => p.filter(s => s.id !== user.id));
    const al={id:"arj"+Date.now(), type:"danger", title:"Cadastro reprovado",
      body:`${user.name} foi reprovado e notificado por e-mail.`,
      time:"agora", read:false, link:{ page:"staff" }};
    setAlerts(p => [al, ...p]);
    (async()=>{const r=await db.deleteStaff(user.id);if(r?.error)console.error(r.error)})();
    (async()=>{const r=await db.upsertAlert(al);if(r?.error)console.error(r.error)})();
  };

  /* ── Checklist mutations ── */
  const upd=(id,fn)=>{
    let updated;
    setCls(p=>{const next=p.map(c=>c.id===id?(updated=fn(c)):c);return next;});
    setOpenCl(p=>p?.id===id?fn(p):p);
    setTimeout(()=>{if(updated) (async()=>{const r=await db.upsertChecklist(updated);if(r?.error)console.error(r.error)})();},0);
  };
  const toggleItem=(cid,iid)=>upd(cid,c=>{const items=c.items.map(i=>i.id===iid?{...i,done:!i.done}:i);return{...c,items,st:items.every(i=>i.done)?"done":items.some(i=>i.crit&&!i.done)?"alert":"in_progress"};});
  const editTxt  =(cid,iid,t)=>upd(cid,c=>({...c,items:c.items.map(i=>i.id===iid?{...i,t}:i)}));
  const addItem  =(cid,t)    =>upd(cid,c=>({...c,items:[...c.items,mk("x"+Date.now(),t)]}));
  const remItem  =(cid,iid)  =>upd(cid,c=>({...c,items:c.items.filter(i=>i.id!==iid)}));
  const setEv    =(cid,iid,ev)=>upd(cid,c=>({...c,items:c.items.map(i=>i.id===iid?{...i,ev:"set",et:typeof ev==="object"?ev.text||"":ev,img:typeof ev==="object"?ev.img||null:null}:i)}));
  const delEv    =(cid,iid)  =>upd(cid,c=>({...c,items:c.items.map(i=>i.id===iid?{...i,ev:null,et:"",img:null,eo:false}:i)}));
  const togEv    =(cid,iid)  =>upd(cid,c=>({...c,items:c.items.map(i=>i.id===iid?{...i,eo:!i.eo}:i)}));
  const delTpl   =(id)       =>{setTpls(p=>p.filter(t=>t.id!==id));setConfirm(null);(async()=>{const r=await db.deleteTemplate(id);if(r?.error)console.error(r.error)})();};
  const createTpl=(tpl)=>{
    const nt={...tpl,id:"tpl"+Date.now()};
    setTpls(p=>[...p,nt]);
    setNewTplM(false);
    (async()=>{const r=await db.upsertTemplate(nt);if(r?.error)console.error(r.error)})();
  };
  const delCl=(id)=>{
    setCls(p=>p.filter(c=>c.id!==id));
    if(openCl?.id===id) setOpenCl(null);
    setConfirm(null);
    (async()=>{const r=await db.deleteChecklist(id);if(r?.error)console.error(r.error)})();
  };
    const addTask  =(task)=>{
    const nt={...task,id:"tk"+Date.now(),done:false,createdAt:new Date().toLocaleDateString("pt-BR"),createdBySid:task.createdBySid||null};
    const m=staff.find(s=>s.id===task.sid);
    const al={id:"tka"+Date.now(),type:"info",title:`Nova tarefa: ${task.title}`,body:`Atribuída a ${m?.name||"—"}${task.dueDate?` · Prazo: ${task.dueDate}`:""}`,time:"agora",read:false,link:{page:"checklists"},sid:task.sid,forAdmins:true};
    setTasks(p=>[nt,...p]);
    setAlerts(p=>[al,...p]);
    setAddTaskM(false);
    (async()=>{const r=await db.upsertTask(nt);if(r?.error)console.error(r.error)})();
    (async()=>{const r=await db.upsertAlert(al);if(r?.error)console.error(r.error)})();
  };
  const toggleTask=(id)=>{
    setTasks(p=>{
      const next=p.map(t=>t.id===id?{...t,done:!t.done}:t);
      const upd=next.find(t=>t.id===id);
      if(upd)(async()=>{const r=await db.upsertTask(upd);if(r?.error)console.error(r.error)})();
      return next;
    });
  };
  const delTask   =(id)=>{ setTasks(p=>p.filter(t=>t.id!==id)); setConfirm(null); (async()=>{const r=await db.deleteTask(id);if(r?.error)console.error(r.error)})(); };
    const addCl=(tid,sid,freq="daily",days=[],dueTime="08:00")=>{
    const tpl=tpls.find(t=>t.id===tid);if(!tpl)return;
    const now=new Date();
    const nc={id:"c"+Date.now(),tid,name:tpl.name,icon:tpl.icon,sid,
      due:`hoje ${dueTime}`,st:"pending",
      freq,days,dueTime,
      lastReset:now.toDateString(),
      overdueAlertSent:false,
      items:tpl.items.map((t,i)=>mk(`x${Date.now()}_${i}`,t))};
    setCls(p=>[nc,...p]);
    const m=staff.find(s=>s.id===sid);
    const al={id:"a"+Date.now(),type:"info",
      title:`Novo checklist: ${tpl.name}`,
      body:`Atribuido a ${m?.name||"—"} · ${FREQ_LABEL(freq,days)} · Prazo ${dueTime}`,
      time:"agora",read:false,link:{page:"checklists",cid:nc.id},sid:sid,forAdmins:true};
    setAlerts(p=>[al,...p]);
    setAddClM(null);setPage("checklists");
    (async()=>{const r=await db.upsertChecklist(nc);if(r?.error)console.error(r.error)})();
    (async()=>{const r=await db.upsertAlert(al);if(r?.error)console.error(r.error)})();
  };
  const onAlert=(al)=>{
    if(!al.link)return;
    setAlerts(p=>p.map(a=>{ if(a.id!==al.id) return a; const u={...a,read:true}; (async()=>{const r=await db.upsertAlert(u);if(r?.error)console.error(r.error)})(); return u; }));
    if(al.link.action==="pending"){setPendingModal(true);return;}
    if(al.link.cid){const t=cls.find(c=>c.id===al.link.cid);if(t){setOpenCl(t);setHlCl(al.link.cid);}}
    setPage(al.link.page||"dashboard");
  };

  /* ── Screens ── */
  if (loading) return (
    <>
      <G/>
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#f0eaff 0%,#f5f6f8 60%)"}}>
        <VeroLogo height={44}/>
        <div style={{marginTop:24,fontSize:14,color:"var(--sub)",display:"flex",alignItems:"center",gap:8}}>
          <span style={{width:18,height:18,border:"2px solid var(--accent)",borderTopColor:"transparent",borderRadius:"50%",display:"inline-block",animation:"spin 0.8s linear infinite"}}/>
          Carregando dados...
        </div>
      </div>
    </>
  );
  if (dbError) return (
    <>
      <G/>
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"var(--rbg)",padding:24}}>
        <Icon n="error_outline" s={48} c="var(--red)"/>
        <div style={{marginTop:12,fontFamily:"var(--fh)",fontWeight:700,fontSize:18,color:"var(--text)"}}>Erro de conexão</div>
        <div style={{marginTop:8,fontSize:13,color:"var(--sub)",textAlign:"center",maxWidth:360}}>{dbError}</div>
        <div style={{marginTop:16,fontSize:12,color:"var(--muted)"}}>Verifique as variáveis REACT_APP_SUPABASE_URL e REACT_APP_SUPABASE_ANON_KEY no arquivo .env</div>
      </div>
    </>
  );
  if (screen==="register") return <RegisterScreen onBack={()=>setScreen("login")} onRegistered={handleRegistered}/>;
  if (!session) return <LoginScreen allStaff={staff} onLogin={s=>{
    setSession(s);
    try { sessionStorage.setItem("vero_session", JSON.stringify({data:s, ts:Date.now()})); } catch {}
  }} onRegister={()=>setScreen("register")}/>;
  if (session.role==="team" || session.role==="leader") {
    const isLeader = session.role==="leader";
    const mySector = isLeader ? session.user.sector : null;
    const sectorPeers = isLeader ? staff.filter(s=>s.sector===mySector&&s.status==="approved"&&!s.admin) : [];
    return <TeamView user={session.user} cls={cls} alerts={alerts} tasks={tasks}
      sectors={sectors} staff={staff}
      isLeader={isLeader} sectorPeers={sectorPeers} tpls={tpls}
      onToggle={toggleItem} onEv={setEv} onDelEv={delEv} onTogEv={togEv}
      onToggleTask={toggleTask}
      onAddCl={isLeader?(tid,sid,freq,days,dueTime)=>addCl(tid,sid,freq,days,dueTime):null}
      onAddTask={(task)=>addTask({...task,createdBySid:session.user.id})}
      onDelTask={(id)=>{if(window.confirm("Deletar esta tarefa?"))delTask(id);}}
      onMarkAlertRead={(id)=>{ setAlerts(p=>p.map(a=>{ if(a.id!==id) return a; const u={...a,read:true}; (async()=>{const r=await db.upsertAlert(u);if(r?.error)console.error(r.error)})(); return u; })); }}
      onLogout={()=>setSession(null)}/>;
  }

  /* ── Admin shell ── */
  const NI=({item})=>{
    const a=page===item.id;
    return(
      <button onClick={()=>setPage(item.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 14px",border:"none",cursor:"pointer",background:a?"var(--abg)":"transparent",color:a?"var(--accent)":"var(--sub)",borderRadius:"var(--rs)",margin:"1px 0",fontWeight:a?600:500,fontSize:14,transition:"all .15s",textAlign:"left",position:"relative"}}>
        <Icon n={item.icon} s={20} c={a?"var(--accent)":"var(--sub)"}/>
        {item.label}
        {item.id==="alerts"&&unread>0&&(
          <span style={{marginLeft:"auto",background:"var(--red)",color:"#fff",borderRadius:100,minWidth:18,height:18,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px"}}>{unread}</span>
        )}
        {item.id==="staff"&&hasPending&&(
          <span style={{marginLeft:item.id==="alerts"?"4px":"auto",background:"var(--warn)",color:"#fff",borderRadius:100,minWidth:18,height:18,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px"}}>{pending.length}</span>
        )}
      </button>
    );
  };

  return(
    <>
      <G/>
      <div className="app">
        {/* Mobile top header — hidden on desktop via CSS */}
        <header className="mh">
          <VeroLogo height={20}/>
          <div style={{position:"relative"}}>
            <button onClick={()=>setUserMenu(p=>!p)}
              style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"1px solid var(--border2)",cursor:"pointer",padding:"5px 10px 5px 6px",borderRadius:100}}>
              <Av v={session.user.av} sz={28} bg="var(--abg)" co="var(--accent)"/>
              <span style={{fontSize:12,fontWeight:600,color:"var(--text)"}}>{session.user.name.split(" ")[0]}</span>
              <Icon n={userMenu?"expand_less":"expand_more"} s={16} c="var(--muted)"/>
            </button>
            {userMenu&&(
              <>
                <div onClick={()=>setUserMenu(false)} style={{position:"fixed",inset:0,zIndex:199}}/>
                <div style={{position:"absolute",top:"calc(100% + 8px)",right:0,background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:"var(--rs)",boxShadow:"var(--shm)",minWidth:180,zIndex:200}}>
                  <div style={{padding:"12px 14px",borderBottom:"1px solid var(--border)"}}>
                    <div style={{fontSize:13,fontWeight:600,color:"var(--text)"}}>{session.user.name}</div>
                    <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{session.user.email}</div>
                    <div style={{fontSize:11,color:"var(--accent)",fontWeight:500,marginTop:2}}>Administrador</div>
                  </div>
                  <button onClick={()=>{ setUserMenu(false); setSession(null); try{sessionStorage.removeItem("vero_session");}catch{} }}
                    style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"11px 14px",background:"none",border:"none",cursor:"pointer",color:"var(--red)",fontSize:13,fontWeight:600,borderRadius:"0 0 var(--rs) var(--rs)"}}>
                    <Icon n="logout" s={16} c="var(--red)"/>Sair da conta
                  </button>
                </div>
              </>
            )}
          </div>
        </header>
        <div className="bdy">
        <aside className="sb">
          <div style={{padding:"20px 16px 12px"}}>
            <VeroLogo height={22}/>
            <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>Gestão Operacional</div>
          </div>
          <Hr/>
          <nav style={{padding:"8px 10px",flex:1}}>{NAV_ADMIN.map(it=><NI key={it.id} item={it}/>)}</nav>
          <Hr/>
          <div style={{padding:"12px 16px"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <Av v={session.user.av} sz={32} bg="var(--abg)" co="var(--accent)"/>
              <div>
                <div style={{fontSize:13,fontWeight:600}}>{session.user.name}</div>
                <div style={{fontSize:11,color:"var(--muted)"}}>Administrador</div>
              </div>
            </div>
            <button onClick={()=>{ setSession(null); try{sessionStorage.removeItem("vero_session");}catch{} }} style={{width:"100%",background:"var(--rbg)",border:"1px solid var(--rbr)",borderRadius:"var(--rs)",padding:"7px 12px",color:"var(--red)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5,fontSize:12,fontWeight:600,transition:"opacity .15s"}} onMouseEnter={e=>e.currentTarget.style.opacity=".8"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
              <Icon n="logout" s={16} c="var(--red)"/>Sair
            </button>
          </div>
        </aside>

        <div className="ma">
          {page==="dashboard"  && <Dash  cls={cls} staff={staff} alerts={alerts} setPage={setPage} onOpenCl={setOpenCl} onAlert={onAlert} pending={pending} onOpenPending={()=>setPendingModal(true)}/>}
          {page==="checklists" && <Cls   cls={cls} staff={staff} onSel={setOpenCl} onAdd={()=>setAddClM({})} onDel={cl=>setConfirm({type:"cl",id:cl.id,msg:`"${cl.name}" será deletado permanentemente. Esta ação não pode ser desfeita.`})} hlCl={hlCl}/>}
          {page==="tasks"      && <AdminTasks tasks={tasks} staff={staff} sectors={sectors} user={session.user} onToggleTask={toggleTask} onDelTask={id=>setConfirm({type:"task",id,msg:"Esta tarefa será deletada permanentemente."})} onAddTask={()=>setAddTaskM(true)}/>}
          {page==="templates"  && <Tpls  tpls={tpls} onUse={id=>setAddClM({tid:id})} onDel={t=>setConfirm({type:"tpl",id:t.id,msg:`"${t.name}" será deletado permanentemente.`})} onNew={()=>setNewTplM(true)}/>}
          {page==="staff"      && <Staff staff={staff} cls={cls} sectors={sectors} pending={pending} onOpenPending={()=>setPendingModal(true)} onEditMember={m=>setEditMemberM(m)} onOpenSectors={()=>setSectorsM(true)} onDeleteMember={m=>setDeleteMemberModal(m)}/>}
          {page==="alerts"     && <Alts  alerts={alerts} onMarkAll={()=>setAlerts(p=>p.map(a=>({...a,read:true})))} onAlert={onAlert}/>}
        </div>

        <nav className="bn">
          {NAV_ADMIN.map(it=>(
            <button key={it.id} onClick={()=>setPage(it.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,background:"none",border:"none",cursor:"pointer",padding:"6px 10px",color:page===it.id?"var(--accent)":"var(--muted)",position:"relative",minWidth:48}}>
              <Icon n={it.icon} s={22} c={page===it.id?"var(--accent)":"var(--muted)"}/>
              <span style={{fontSize:10,fontWeight:page===it.id?600:400}}>{it.label}</span>
              {it.id==="alerts"&&unread>0&&<span style={{position:"absolute",top:3,right:4,background:"var(--red)",color:"#fff",borderRadius:100,width:15,height:15,fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{unread}</span>}
              {it.id==="staff"&&hasPending&&<span style={{position:"absolute",top:3,right:4,background:"var(--warn)",color:"#fff",borderRadius:100,width:15,height:15,fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{pending.length}</span>}
            </button>
          ))}
        </nav>
        </div>
      </div>

      {openCl   && <ClDetail cl={openCl} staff={staff} onClose={()=>{setOpenCl(null);setHlCl(null);}} onToggle={id=>toggleItem(openCl.id,id)} onEdit={(id,t)=>editTxt(openCl.id,id,t)} onAdd={t=>addItem(openCl.id,t)} onRem={id=>remItem(openCl.id,id)} onEv={(id,et)=>setEv(openCl.id,id,et)} onDelEv={id=>delEv(openCl.id,id)} onTogEv={id=>togEv(openCl.id,id)}/>}
      {addClM!==null && <AddCl staff={staff.filter(s=>!s.admin&&s.status==="approved")} tpls={tpls} pre={addClM?.tid} onClose={()=>setAddClM(null)} onAdd={addCl}/>}
      {newTplM       && <NewTpl onClose={()=>setNewTplM(false)} onCreate={createTpl}/>}
      {confirm       && <Confirm msg={confirm.msg} onOk={()=>confirm.type==="tpl"?delTpl(confirm.id):confirm.type==="cl"?delCl(confirm.id):confirm.type==="task"?delTask(confirm.id):null} onCancel={()=>setConfirm(null)}/>}
      {pendingModal  && pending.length > 0 && <PendingModal pending={pending} onApprove={approveMember} onReject={rejectMember} onClose={()=>setPendingModal(false)}/>}
      {addTaskM && <AddTaskModal staff={staff.filter(s=>!s.admin&&s.status==="approved")} onClose={()=>setAddTaskM(false)} onAdd={addTask}/>}
      {editMemberM && <EditMemberModal member={editMemberM} sectors={sectors} onClose={()=>setEditMemberM(null)} onSave={updateMember}/>}
      {sectorsM    && <SectorsModal sectors={sectors} setSectors={setSectors} onClose={()=>setSectorsM(false)}/>}
      {deleteMemberModal && <DeleteMemberModal
        member={deleteMemberModal}
        onClose={()=>setDeleteMemberModal(null)}
        onConfirm={member=>{
          setStaff(p=>p.filter(s=>s.id!==member.id));
          setDeleteMemberModal(null);
          (async()=>{const r=await db.deleteStaff(member.id);if(r?.error)console.error(r.error)})();
        }}
      />}
    </>
  );
}
/* ═══ DASHBOARD ═════════════════════════════════════════════════════════════ */
function Dash({cls,staff,alerts,setPage,onOpenCl,onAlert,pending,onOpenPending}){
  const done=cls.filter(c=>c.st==="done").length;
  const inp=cls.filter(c=>c.st==="in_progress").length;
  const alc=cls.filter(c=>c.st==="alert").length;
  const all=cls.flatMap(c=>c.items);
  const ov=all.length?Math.round(all.filter(i=>i.done).length/all.length*100):0;
  const top=[...staff].sort((a,b)=>b.score-a.score).slice(0,3);
  const stats=[
    {label:"Progresso Geral",val:`${ov}%`,c:"var(--accent)",sub:`${all.filter(i=>i.done).length}/${all.length} tarefas`,icon:"pie_chart",bar:true},
    {label:"Concluidos",val:done,c:"var(--accent)",sub:"hoje",icon:"task_alt"},
    {label:"Em Andamento",val:inp,c:"var(--warn)",sub:"checklists",icon:"pending_actions"},
    {label:"Alertas",val:alc,c:"var(--red)",sub:"atencao",icon:"error_outline"},
  ];
  return(
    <div className="pp fu">
      <div style={{marginBottom:22}}>
        <h1 style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:22}}>Painel de Controle</h1>
        <p style={{fontSize:13,color:"var(--sub)",marginTop:3}}>Visao geral da operacao de hoje</p>
      </div>
      {pending&&pending.length>0&&(
        <div onClick={onOpenPending} style={{background:"var(--wbg)",border:"1.5px solid var(--wbr)",borderRadius:"var(--rs)",padding:"13px 16px",marginBottom:18,display:"flex",alignItems:"center",gap:12,cursor:"pointer",transition:"box-shadow .15s",boxShadow:"var(--sh)"}} onMouseEnter={e=>e.currentTarget.style.boxShadow="var(--shm)"} onMouseLeave={e=>e.currentTarget.style.boxShadow="var(--sh)"}>
          <div style={{width:38,height:38,borderRadius:"50%",background:"var(--warn)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <Icon n="how_to_reg" s={20} c="#fff"/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontWeight:600,fontSize:13}}>{pending.length} cadastro{pending.length!==1?"s":""} aguardando aprovação</div>
            <div style={{fontSize:12,color:"var(--sub)",marginTop:1}}>Clique para revisar e aprovar ou reprovar</div>
          </div>
          <Icon n="arrow_forward_ios" s={15} c="var(--warn)"/>
        </div>
      )}
      <div className="g4" style={{display:"grid",gap:12,marginBottom:20}}>
        {stats.map((s,i)=>(
          <Card key={i} onClick={()=>setPage("checklists")} style={{padding:"16px 18px",cursor:"pointer"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <span style={{fontSize:11,fontWeight:600,color:"var(--sub)",textTransform:"uppercase",letterSpacing:"0.05em"}}>{s.label}</span>
              <Icon n={s.icon} s={20} c={s.c}/>
            </div>
            <div style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:28,color:s.c,lineHeight:1}}>{s.val}</div>
            <div style={{fontSize:11,color:"var(--muted)",marginTop:5}}>{s.sub}</div>
            {s.bar&&<div style={{marginTop:10}}><Bar v={ov} h={4}/></div>}
          </Card>
        ))}
      </div>
      <div className="g2" style={{display:"grid",gap:16}}>
        <Card style={{padding:0,overflow:"hidden"}}>
          <div style={{padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid var(--border)"}}>
            <div style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:14,display:"flex",alignItems:"center",gap:7}}>
              <Icon n="checklist" s={20} c="var(--sub)"/>Checklists Recentes
            </div>
            <button onClick={()=>setPage("checklists")} style={{background:"none",border:"none",color:"var(--accent)",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:3}}>
              Ver todos<Icon n="arrow_forward" s={16} c="var(--accent)"/>
            </button>
          </div>
          {cls.slice(0,4).map((c,i)=>{
            const p=pct(c.items);const m=staff.find(s=>s.id===c.sid);
            return(
              <div key={c.id} onClick={()=>onOpenCl(c)} style={{padding:"12px 18px",borderBottom:i<3?"1px solid var(--border)":"none",cursor:"pointer",transition:"background .12s"}} onMouseEnter={e=>e.currentTarget.style.background="var(--bg)"} onMouseLeave={e=>e.currentTarget.style.background=""}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <span style={{fontSize:18}}>{c.icon}</span>
                    <div><div style={{fontWeight:600,fontSize:13}}>{c.name}</div><div style={{fontSize:11,color:"var(--muted)"}}>{m?.name}</div></div>
                  </div>
                  <SPill s={c.st}/>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{flex:1}}><Bar v={p}/></div>
                  <span style={{fontSize:11,fontWeight:600,color:"var(--sub)",flexShrink:0}}>{p}%</span>
                </div>
              </div>
            );
          })}
        </Card>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <Card style={{padding:0,overflow:"hidden"}}>
            <div style={{padding:"14px 18px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:14,display:"flex",alignItems:"center",gap:7}}>
                <Icon n="emoji_events" s={20} c="var(--sub)"/>Top Funcionarios
              </div>
              <button onClick={()=>setPage("staff")} style={{background:"none",border:"none",color:"var(--accent)",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:3}}>
                Ver todos<Icon n="arrow_forward" s={16} c="var(--accent)"/>
              </button>
            </div>
            {top.map((s,i)=>(
              <div key={s.id} style={{padding:"11px 18px",borderBottom:i<2?"1px solid var(--border)":"none",display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:14,color:["#f59e0b","#94a3b8","#cd7c2f"][i],width:22,textAlign:"center"}}>#{i+1}</span>
                <Av v={s.av} sz={30} bg={i===0?"#fef9c3":"var(--surface)"} co={i===0?"#854d0e":"#4b5563"}/>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,marginBottom:3}}>{s.name}</div><Bar v={s.score}/></div>
                <span style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:14,color:s.score>=80?"var(--accent)":s.score>=60?"var(--warn)":"var(--red)"}}>{s.score}</span>
              </div>
            ))}
          </Card>
          <Card style={{padding:0,overflow:"hidden"}}>
            <div style={{padding:"14px 18px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:14,display:"flex",alignItems:"center",gap:7}}>
                <Icon n="notifications" s={20} c="var(--sub)"/>Alertas Recentes
              </div>
              <button onClick={()=>setPage("alerts")} style={{background:"none",border:"none",color:"var(--accent)",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:3}}>
                Ver todos<Icon n="arrow_forward" s={16} c="var(--accent)"/>
              </button>
            </div>
            {alerts.slice(0,3).map((al,i)=>(
              <div key={al.id} onClick={()=>onAlert(al)} style={{padding:"11px 18px",borderBottom:i<2?"1px solid var(--border)":"none",display:"flex",gap:10,alignItems:"center",cursor:al.link?"pointer":"default",transition:"background .12s",opacity:al.read?.6:1}} onMouseEnter={e=>{if(al.link)e.currentTarget.style.background="var(--bg)"}} onMouseLeave={e=>e.currentTarget.style.background=""}>
                <Icon n={TI[al.type]} s={20} c={TC[al.type]}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{al.title}</div>
                  <div style={{fontSize:11,color:"var(--muted)",marginTop:1}}>{al.time}</div>
                </div>
                {!al.read&&<div style={{width:7,height:7,borderRadius:"50%",background:"var(--accent)",flexShrink:0}}/>}
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ═══ CHECKLISTS ════════════════════════════════════════════════════════════ */
function Cls({cls,staff,onSel,onAdd,onDel,hlCl}){
  const [filter,setFilter]=useState("all");
  const FILTERS=[{id:"all",l:"Todos"},{id:"alert",l:"Alertas"},{id:"in_progress",l:"Em andamento"},{id:"done",l:"Concluídos"},{id:"pending",l:"Pendentes"}];
  const list=filter==="all"?cls:cls.filter(c=>c.st===filter);
  return(
    <div className="pp fu">
      {/* ── Checklists section ── */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
        <div>
          <h1 style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:22}}>Checklists</h1>
          <p style={{fontSize:13,color:"var(--sub)",marginTop:3}}>{cls.length} ativos</p>
        </div>
        <Btn onClick={onAdd}><Icon n="add" s={20}/>Novo Checklist</Btn>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:18}}>
        {FILTERS.map(f=>(
          <button key={f.id} onClick={()=>setFilter(f.id)} style={{padding:"5px 13px",borderRadius:100,border:filter===f.id?"1px solid var(--accent)":"1px solid var(--border2)",background:filter===f.id?"var(--abg)":"transparent",color:filter===f.id?"var(--accent)":"var(--sub)",fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .15s"}}>{f.l}</button>
        ))}
      </div>
      <div className="cg" style={{display:"grid",gap:14,marginBottom:36}}>
        {list.map((cl,i)=>{
          const p=pct(cl.items);const m=staff.find(s=>s.id===cl.sid);
          const ev=cl.items.filter(i=>i.ev).length;const hl=hlCl===cl.id;
          return(
            <div key={cl.id} onClick={()=>onSel(cl)} style={{background:"var(--surface)",border:`1.5px solid ${hl?"var(--accent)":cl.st==="alert"?"var(--rbr)":"var(--border)"}`,borderRadius:"var(--r)",boxShadow:hl?"0 0 0 3px var(--abr)":"var(--sh)",padding:"16px",cursor:"pointer",transition:"all .18s",animation:`fadeUp ${.15+i*.04}s ease`}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow="var(--shm)";e.currentTarget.style.borderColor=hl?"var(--accent)":cl.st==="alert"?"var(--red)":"var(--border2)";}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow=hl?"0 0 0 3px var(--abr)":"var(--sh)";e.currentTarget.style.borderColor=hl?"var(--accent)":cl.st==="alert"?"var(--rbr)":"var(--border)";}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div style={{display:"flex",gap:10,alignItems:"center",flex:1,minWidth:0}}>
                  <span style={{fontSize:22,flexShrink:0}}>{cl.icon}</span>
                  <div style={{minWidth:0}}>
                    <div style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:14,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{cl.name}</div>
                    <div style={{fontSize:11,color:"var(--muted)",marginTop:2,display:"flex",alignItems:"center",gap:3}}>
                      <Icon n="schedule" s={12} c="var(--muted)"/>{cl.due}
                    </div>
                    {cl.freq&&<div style={{fontSize:10,color:"var(--accent)",fontWeight:500,display:"flex",alignItems:"center",gap:2,marginTop:2}}>
                      <Icon n="autorenew" s={11} c="var(--accent)"/>{FREQ_LABEL(cl.freq,cl.days||[])}
                    </div>}
                  </div>
                </div>
                <SPill s={cl.st}/>
              </div>
              <Bar v={p} h={5}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <Av v={m?.av||"?"} sz={20} bg="var(--surface)" co="#4b5563"/>
                  <span style={{fontSize:11,color:"var(--sub)"}}>{m?.name}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  {ev>0&&<span style={{fontSize:11,color:"var(--accent)",fontWeight:500,display:"flex",alignItems:"center",gap:2}}><Icon n="attach_file" s={13} c="var(--accent)"/>{ev}</span>}
                  <span style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:13,color:p===100?"var(--accent)":"var(--text)"}}>{p}%</span>
                </div>
              </div>
              <div style={{marginTop:8,fontSize:11,color:"var(--muted)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:3}}>
                <span style={{display:"flex",alignItems:"center",gap:3}}><Icon n="check" s={13} c="var(--muted)"/>{cl.items.filter(i=>i.done).length}/{cl.items.length} itens</span>
                <button onClick={e=>{e.stopPropagation();onDel(cl);}}
                  style={{background:"none",border:"none",cursor:"pointer",color:"var(--muted)",display:"flex",alignItems:"center",gap:3,fontSize:11,fontWeight:500,padding:"2px 6px",borderRadius:4,transition:"all .15s"}}
                  onMouseEnter={e=>{e.currentTarget.style.color="var(--red)";e.currentTarget.style.background="var(--rbg)";}}
                  onMouseLeave={e=>{e.currentTarget.style.color="var(--muted)";e.currentTarget.style.background="none";}}>
                  <Icon n="delete_outline" s={14}/>Deletar
                </button>
              </div>
            </div>
          );
        })}
        {list.length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:"40px 20px",color:"var(--muted)"}}><Icon n="search_off" s={40} c="var(--border2)"/><div style={{marginTop:10,fontSize:14}}>Nenhum checklist neste filtro.</div></div>}
      </div>

    </div>
  );
}

/* ═══ CHECKLIST DETAIL (ADMIN) ══════════════════════════════════════════════ */
function ClDetail({cl,staff,onClose,onToggle,onEdit,onAdd,onRem,onEv,onDelEv,onTogEv}){
  const [eid,setEid]=useState(null);
  const [eval_,setEval]=useState("");
  const [evIn,setEvIn]=useState({});
  const [evFor,setEvFor]=useState(null);
  const [evMode,setEvMode]=useState("text");
  const [evImg,setEvImg]=useState(null);
  const [ni,setNi]=useState("");
  const [adding,setAdding]=useState(false);
  const fileRef=useRef(null);
  const m=staff.find(s=>s.id===cl.sid);
  const p=pct(cl.items);
  const pickFile=()=>fileRef.current?.click();
  const handleFile=f=>{if(!f||!f.type.startsWith("image/"))return;const r=new FileReader();r.onload=e=>setEvImg(e.target.result);r.readAsDataURL(f);};
  const submitEv=itemId=>{if(evMode==="photo"&&!evImg)return;onEv(itemId,evMode==="photo"?{img:evImg,text:evIn[itemId]||""}:evIn[itemId]||"Evidencia registrada");setEvFor(null);setEvImg(null);setEvMode("text");};
  return(
    <Ov onClick={onClose}>
      <Sheet onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <span style={{fontSize:28}}>{cl.icon}</span>
            <div>
              <div style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:17}}>{cl.name}</div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4,flexWrap:"wrap"}}>
                <Av v={m?.av||"?"} sz={18} bg="var(--surface)" co="#4b5563"/>
                <span style={{fontSize:12,color:"var(--sub)"}}>{m?.name}</span>
                <SPill s={cl.st}/>
                {cl.freq&&<span style={{fontSize:11,color:"var(--accent)",fontWeight:500,display:"flex",alignItems:"center",gap:3}}>
                  <Icon n="autorenew" s={13} c="var(--accent)"/>{FREQ_LABEL(cl.freq,cl.days||[])}
                </span>}
                {cl.dueTime&&<span style={{fontSize:11,color:"var(--sub)",display:"flex",alignItems:"center",gap:3}}>
                  <Icon n="schedule" s={13} c="var(--sub)"/>Prazo {cl.dueTime}
                </span>}
              </div>
            </div>
          </div>
          <Btn v="g" sz="s" onClick={onClose} style={{padding:4}}><Icon n="close" s={20}/></Btn>
        </div>
        <div style={{marginBottom:18}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"var(--sub)",marginBottom:5}}>
            <span>{cl.items.filter(i=>i.done).length} de {cl.items.length} itens</span>
            <span style={{fontWeight:600,color:"var(--text)"}}>{p}%</span>
          </div>
          <Bar v={p} h={6}/>
        </div>
        <Hr/>
        <div style={{marginTop:14,display:"flex",flexDirection:"column",gap:8}}>
          {cl.items.map((item,idx)=>(
            <div key={item.id}>
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:item.done?"var(--abg)":item.crit?"var(--rbg)":"var(--bg)",border:`1px solid ${item.done?"var(--abr)":item.crit?"var(--rbr)":"var(--border)"}`,borderRadius:item.ev&&item.eo?"var(--rs) var(--rs) 0 0":"var(--rs)",animation:`fadeUp ${.08+idx*.02}s ease`}}>
                <div onClick={()=>onToggle(item.id)} style={{width:20,height:20,borderRadius:5,flexShrink:0,cursor:"pointer",background:item.done?"var(--accent)":"var(--surface)",border:`2px solid ${item.done?"var(--accent)":item.crit?"var(--red)":"var(--border2)"}`,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"}}>
                  {item.done&&<Icon n="check" s={13} c="#fff"/>}
                </div>
                {eid===item.id?(
                  <input autoFocus value={eval_} onChange={e=>setEval(e.target.value)}
                    onKeyDown={e=>{if(e.key==="Enter"){if(eval_.trim())onEdit(item.id,eval_.trim());setEid(null);}if(e.key==="Escape")setEid(null);}}
                    style={{flex:1,background:"var(--surface)",border:"1px solid var(--accent)",borderRadius:5,padding:"4px 8px",color:"var(--text)",fontSize:13,outline:"none"}}/>
                ):(
                  <span style={{flex:1,fontSize:13,textDecoration:item.done?"line-through":"none",color:item.done?"var(--muted)":"var(--text)",lineHeight:1.45,display:"flex",alignItems:"center",gap:4}}>
                    {item.crit&&!item.done&&<Icon n="warning_amber" s={15} c="var(--red)"/>}
                    {item.t}
                  </span>
                )}
                <div style={{display:"flex",gap:2,flexShrink:0}}>
                  {eid===item.id?(
                    <Btn sz="s" v="p" onClick={()=>{if(eval_.trim())onEdit(item.id,eval_.trim());setEid(null);}}><Icon n="check" s={20}/></Btn>
                  ):(
                    <Btn sz="s" v="g" onClick={()=>{setEid(item.id);setEval(item.t);}}><Icon n="edit" s={20}/></Btn>
                  )}
                  {item.ev?(
                    <button onClick={()=>onTogEv(item.id)} style={{background:"var(--abg)",border:"1px solid var(--abr)",borderRadius:5,padding:"4px 8px",color:"var(--accent)",cursor:"pointer",display:"flex",alignItems:"center",gap:3,fontSize:12,fontWeight:600}}>
                      <Icon n="attach_file" s={20} c="var(--accent)"/>
                      <Icon n={item.eo?"expand_less":"expand_more"} s={20} c="var(--accent)"/>
                    </button>
                  ):(
                    <Btn sz="s" v="g" onClick={()=>{setEvFor(evFor===item.id?null:item.id);setEvImg(null);setEvMode("text");}}><Icon n="attach_file" s={20}/></Btn>
                  )}
                  <Btn sz="s" v="g" onClick={()=>onRem(item.id)}><Icon n="delete_outline" s={20}/></Btn>
                </div>
              </div>
              {evFor===item.id&&!item.ev&&(
                <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderTop:"none",borderRadius:"0 0 var(--rs) var(--rs)",padding:"12px 14px",animation:"fadeUp .15s ease"}}>
                  <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
                  <div style={{display:"flex",gap:6,marginBottom:10}}>
                    {[["text","notes","Texto"],["photo","photo_camera","Foto"]].map(([mode,ic,lbl])=>(
                      <button key={mode} onClick={()=>setEvMode(mode)} style={{flex:1,padding:"6px",borderRadius:"var(--rs)",border:`1.5px solid ${evMode===mode?"var(--accent)":"var(--border2)"}`,background:evMode===mode?"var(--abg)":"transparent",color:evMode===mode?"var(--accent)":"var(--sub)",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                        <Icon n={ic} s={15} c={evMode===mode?"var(--accent)":"var(--sub)"}/>{lbl}
                      </button>
                    ))}
                  </div>
                  {evMode==="text"?(
                    <div style={{display:"flex",gap:6}}>
                      <Inp val={evIn[item.id]||""} onChange={e=>setEvIn(p=>({...p,[item.id]:e.target.value}))} ph="Descreva a evidencia..."/>
                      <Btn onClick={()=>submitEv(item.id)}>OK</Btn>
                      <Btn v="o" onClick={()=>setEvFor(null)}><Icon n="close" s={20}/></Btn>
                    </div>
                  ):(
                    <div>
                      {evImg?(
                        <div style={{position:"relative",marginBottom:8}}>
                          <img src={evImg} alt="preview" style={{width:"100%",maxHeight:180,objectFit:"cover",borderRadius:"var(--rs)"}}/>
                          <button onClick={()=>setEvImg(null)} style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,.5)",border:"none",borderRadius:"50%",width:24,height:24,color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon n="close" s={15} c="#fff"/></button>
                        </div>
                      ):(
                        <div onClick={pickFile} onDrop={e=>{e.preventDefault();handleFile(e.dataTransfer.files[0]);}} onDragOver={e=>e.preventDefault()}
                          style={{border:"2px dashed var(--border2)",borderRadius:"var(--rs)",padding:"28px 16px",textAlign:"center",cursor:"pointer",marginBottom:8,transition:"all .15s"}}
                          onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--accent)";e.currentTarget.style.background="var(--abg)";}}
                          onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border2)";e.currentTarget.style.background="transparent";}}>
                          <Icon n="add_photo_alternate" s={32} c="var(--muted)"/>
                          <div style={{fontSize:12,color:"var(--sub)",marginTop:6}}>Clique ou arraste uma foto</div>
                        </div>
                      )}
                      <Inp val={evIn[item.id]||""} onChange={e=>setEvIn(p=>({...p,[item.id]:e.target.value}))} ph="Legenda (opcional)..." style={{marginBottom:8}}/>
                      <div style={{display:"flex",gap:6}}>
                        <Btn onClick={()=>submitEv(item.id)} dis={!evImg}><Icon n="check" s={18}/>Salvar</Btn>
                        <Btn v="o" onClick={()=>setEvFor(null)}><Icon n="close" s={20}/></Btn>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {item.ev&&item.eo&&(
                <div style={{background:"var(--abg)",border:"1px solid var(--abr)",borderTop:"none",borderRadius:"0 0 var(--rs) var(--rs)",padding:"12px 14px",animation:"fadeUp .18s ease"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:10,color:"var(--accent)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6}}>Evidência</div>
                      {item.img&&<img src={item.img} alt="evidence" style={{width:"100%",maxHeight:200,objectFit:"cover",borderRadius:"var(--rs)",marginBottom:8}}/>}
                      {item.et&&<div style={{fontSize:13,color:"var(--text)",lineHeight:1.5}}>{item.et}</div>}
                    </div>
                    <Btn sz="s" v="d" onClick={()=>onDelEv(item.id)}><Icon n="delete_outline" s={20}/></Btn>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div style={{marginTop:4}}>
            {adding?(
              <div style={{display:"flex",gap:7}}>
                <Inp val={ni} onChange={e=>setNi(e.target.value)}
                  onKeyDown={e=>{if(e.key==="Enter"&&ni.trim()){onAdd(ni.trim());setNi("");setAdding(false);}if(e.key==="Escape")setAdding(false);}}
                  ph="Descreva o novo item..."/>
                <Btn onClick={()=>{if(ni.trim()){onAdd(ni.trim());setNi("");setAdding(false);}}}><Icon n="add" s={20}/></Btn>
                <Btn v="o" onClick={()=>setAdding(false)}><Icon n="close" s={20}/></Btn>
              </div>
            ):(
              <button onClick={()=>setAdding(true)} style={{width:"100%",background:"none",border:"1px dashed var(--border2)",borderRadius:"var(--rs)",padding:"9px",color:"var(--sub)",fontSize:12,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4,transition:"all .15s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--accent)";e.currentTarget.style.color="var(--accent)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border2)";e.currentTarget.style.color="var(--sub)";}}>
                <Icon n="add" s={20}/>Adicionar Item
              </button>
            )}
          </div>
        </div>
      </Sheet>
    </Ov>
  );
}

/* ═══ TEMPLATES ═════════════════════════════════════════════════════════════ */
function Tpls({tpls,onUse,onDel,onNew}){
  const cats=[...new Set(tpls.map(t=>t.cat))];
  return(
    <div className="pp fu">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <h1 style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:22}}>Templates</h1>
          <p style={{fontSize:13,color:"var(--sub)",marginTop:3}}>{tpls.length} modelos</p>
        </div>
        <Btn onClick={onNew}><Icon n="add" s={20}/>Novo Template</Btn>
      </div>
      {cats.map(cat=>(
        <div key={cat} style={{marginBottom:28}}>
          <div style={{fontSize:11,fontWeight:700,color:"var(--sub)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:12}}>{cat}</div>
          <div className="cg" style={{display:"grid",gap:12}}>
            {tpls.filter(t=>t.cat===cat).map((tpl,i)=>(
              <Card key={tpl.id} style={{padding:"16px",animation:`fadeUp ${.15+i*.04}s ease`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <span style={{fontSize:22}}>{tpl.icon}</span>
                    <div>
                      <div style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:14}}>{tpl.name}</div>
                      <div style={{fontSize:11,color:"var(--muted)",marginTop:2,display:"flex",alignItems:"center",gap:3}}>
                        <Icon n="assignment" s={12} c="var(--muted)"/>{tpl.items.length} itens
                      </div>
                    </div>
                  </div>
                  <Btn sz="s" v="d" onClick={()=>onDel(tpl)}><Icon n="delete_outline" s={20}/></Btn>
                </div>
                <div style={{marginBottom:14,display:"flex",flexDirection:"column",gap:4}}>
                  {tpl.items.slice(0,3).map((it,i)=>(
                    <div key={i} style={{fontSize:12,color:"var(--sub)",display:"flex",gap:6,alignItems:"flex-start"}}>
                      <Icon n="check" s={13} c="var(--muted)" style={{marginTop:1,flexShrink:0}}/>{it}
                    </div>
                  ))}
                  {tpl.items.length>3&&<div style={{fontSize:11,color:"var(--muted)",marginLeft:19}}>+{tpl.items.length-3} mais</div>}
                </div>
                <Btn v="o" onClick={()=>onUse(tpl.id)} style={{width:"100%",justifyContent:"center"}}>
                  <Icon n="play_arrow" s={20}/>Usar Template
                </Btn>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══ STAFF ═════════════════════════════════════════════════════════════════*/
function Staff({ staff, cls, sectors, pending, onOpenPending, onEditMember, onDeleteMember, onOpenSectors }) {
  const ranked  = [...staff].filter(s=>s.status!=="pending").sort((a,b)=>b.score-a.score);
  const MROLE   = { admin:"Admin", leader:"Líder", base:"Equipe Base", team:"Equipe" };
  const MCOLOR  = { admin:{c:"var(--accent)",bg:"var(--abg)"}, leader:{c:"var(--blue)",bg:"var(--bbg)"}, base:{c:"var(--sub)",bg:"var(--bg)"}, team:{c:"var(--sub)",bg:"var(--bg)"} };
  const safeMColor = (role) => MCOLOR[role] || MCOLOR["base"];

  return (
    <div className="pp fu">
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
        <div>
          <h1 style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:22}}>Equipe</h1>
          <p style={{fontSize:13,color:"var(--sub)",marginTop:3}}>{staff.filter(s=>s.status==="approved").length} membros ativos</p>
        </div>
        <Btn v="g" onClick={onOpenSectors} style={{border:"1px solid var(--border2)",color:"var(--sub)"}}>
          <Icon n="category" s={18} c="var(--blue)"/>Setores
        </Btn>
      </div>

      {/* Pending approvals */}
      {pending&&pending.length>0&&(
        <div style={{marginBottom:20}}>
          <div style={{fontSize:11,fontWeight:700,color:"var(--warn)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
            <Icon n="pending" s={15} c="var(--warn)"/>Aguardando Aprovação ({pending.length})
          </div>
          {pending.map(s=>(
            <div key={s.id} style={{background:"var(--wbg)",border:"1px solid var(--wbr)",borderRadius:"var(--rs)",padding:"12px 16px",display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
              <Av v={s.av} sz={36} bg="#fef9c3" co="#854d0e"/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:13}}>{s.name}</div>
                <div style={{fontSize:11,color:"var(--sub)",display:"flex",gap:10,marginTop:2,flexWrap:"wrap"}}>
                  <span style={{display:"flex",alignItems:"center",gap:3}}><Icon n="mail_outline" s={12} c="var(--muted)"/>{s.email}</span>
                  <span style={{display:"flex",alignItems:"center",gap:3}}><Icon n="phone_iphone" s={12} c="var(--muted)"/>{s.phone}</span>
                </div>
              </div>
              <Btn sz="s" v="o" onClick={onOpenPending}>Revisar</Btn>
            </div>
          ))}
        </div>
      )}

      {/* Podium */}
      {ranked.length>=2&&(
        <Card style={{marginBottom:20,display:"flex",justifyContent:"center",alignItems:"flex-end",gap:20,padding:"24px",overflow:"hidden",position:"relative"}}>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,var(--abg),#fff)",pointerEvents:"none"}}/>
          {[ranked[1],ranked[0],ranked[2]].map((s,i)=>{
            if(!s)return null;
            const pos=i===0?2:i===1?1:3;
            const hs=[90,118,70];
            const colors=["#94a3b8","#f59e0b","#cd7c2f"];
            return(
              <div key={s.id} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,position:"relative",zIndex:1}}>
                <Av v={s.av} sz={38} bg={i===1?"#fefce8":"var(--surface)"} co={colors[i]}/>
                <div style={{fontSize:12,fontWeight:600,textAlign:"center"}}>{s.name.split(" ")[0]}</div>
                <div style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:18,color:colors[i]}}>{s.score}</div>
                <div style={{width:62,height:hs[i],background:`${colors[i]}18`,border:`1px solid ${colors[i]}44`,borderRadius:"6px 6px 0 0",display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:8,fontFamily:"var(--fh)",fontWeight:600,fontSize:20,color:colors[i]}}>#{pos}</div>
              </div>
            );
          })}
        </Card>
      )}

      {/* Sectors summary strip */}
      {sectors.length>0&&(
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:18}}>
          {sectors.map(sec=>{
            const count=ranked.filter(s=>s.sector===sec.id).length;
            return(
              <div key={sec.id} style={{display:"flex",alignItems:"center",gap:5,background:"var(--bbg)",border:"1px solid #bfdbfe",borderRadius:100,padding:"4px 12px",fontSize:12,color:"var(--blue)",fontWeight:500}}>
                <Icon n="corporate_fare" s={13} c="var(--blue)"/>{sec.name}
                <span style={{background:"var(--blue)",color:"#fff",borderRadius:100,width:16,height:16,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{count}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Member list */}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {ranked.map((s,i)=>{
          const mc   = cls.filter(c=>c.sid===s.id);
          const done = mc.filter(c=>c.st==="done").length;
          const mr   = safeMColor(s.memberRole);
          const sec  = sectors.find(x=>x.id===s.sector);
          return(
            <Card key={s.id} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",animation:`fadeUp ${.15+i*.04}s ease`}}>
              <span style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:15,color:"var(--muted)",width:22,textAlign:"center"}}>#{i+1}</span>
              <Av v={s.av} sz={40} bg={i===0?"#fefce8":"var(--surface)"} co={i===0?"#854d0e":"#4b5563"}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4,flexWrap:"wrap"}}>
                  <span style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:14}}>{s.name}</span>
                  <Pill ch={s.role||"—"} c="var(--sub)" b="var(--surface)" br="var(--border)"/>
                  <span style={{fontSize:11,fontWeight:600,color:mr.c,background:mr.bg,borderRadius:100,padding:"2px 8px"}}>{MROLE[s.memberRole||"base"]}</span>
                  {sec&&<span style={{fontSize:11,color:"var(--blue)",background:"var(--bbg)",borderRadius:100,padding:"2px 8px",fontWeight:500,display:"flex",alignItems:"center",gap:3}}><Icon n="corporate_fare" s={11} c="var(--blue)"/>{sec.name}</span>}
                </div>
                <div style={{fontSize:11,color:"var(--muted)",marginBottom:6,display:"flex",alignItems:"center",gap:12}}>
                  <span style={{display:"flex",alignItems:"center",gap:3}}><Icon n="mail_outline" s={12} c="var(--muted)"/>{s.email}</span>
                  <span style={{display:"flex",alignItems:"center",gap:3}}><Icon n="task_alt" s={13} c="var(--muted)"/>{done} concluídos</span>
                </div>
                <Bar v={s.score}/>
              </div>
              <span style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:24,color:s.score>=80?"var(--accent)":s.score>=60?"var(--warn)":"var(--red)",flexShrink:0}}>{s.score}</span>
              <button onClick={()=>onEditMember(s)}
                style={{background:"var(--bg)",border:"1px solid var(--border2)",borderRadius:"var(--rs)",padding:"7px 12px",cursor:"pointer",color:"var(--sub)",display:"flex",alignItems:"center",gap:5,fontSize:12,fontWeight:500,transition:"all .15s",flexShrink:0}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--accent)";e.currentTarget.style.color="var(--accent)";e.currentTarget.style.background="var(--abg)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border2)";e.currentTarget.style.color="var(--sub)";e.currentTarget.style.background="var(--bg)";}}>
                <Icon n="edit" s={15}/>Editar
              </button>
              {onDeleteMember&&!s.admin&&(
                <button onClick={()=>onDeleteMember(s)}
                  style={{background:"var(--bg)",border:"1px solid var(--border2)",borderRadius:"var(--rs)",padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:600,color:"var(--muted)",display:"flex",alignItems:"center",gap:5,marginLeft:6,transition:"all .15s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--red)";e.currentTarget.style.color="var(--red)";e.currentTarget.style.background="var(--rbg)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border2)";e.currentTarget.style.color="var(--muted)";e.currentTarget.style.background="var(--bg)";}}>
                  <Icon n="person_remove" s={15}/>Excluir
                </button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}



/* ═══ DELETE MEMBER PIN MODAL ═══════════════════════════════════════════════ */
function DeleteMemberModal({ member, onConfirm, onClose }) {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const PIN = "1109";
  const submit = () => {
    if (pin !== PIN) { setErr("PIN incorreto. Tente novamente."); setPin(""); return; }
    onConfirm(member);
  };
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:20}}>
      <div style={{background:"var(--surface)",borderRadius:"var(--r)",padding:28,width:"100%",maxWidth:360,boxShadow:"var(--shm)",animation:"fadeUp .15s ease"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
          <div style={{width:40,height:40,borderRadius:"50%",background:"var(--rbg)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <Icon n="person_remove" s={22} c="var(--red)"/>
          </div>
          <div>
            <div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:16}}>Excluir membro</div>
            <div style={{fontSize:13,color:"var(--sub)",marginTop:2}}>Esta ação é permanente e não pode ser desfeita.</div>
          </div>
        </div>
        <div style={{background:"var(--rbg)",border:"1px solid var(--rbr)",borderRadius:"var(--rs)",padding:"10px 14px",marginBottom:18,display:"flex",alignItems:"center",gap:8}}>
          <Icon n="warning_amber" s={16} c="var(--red)"/>
          <span style={{fontSize:13,color:"var(--red)",fontWeight:600}}>{member.name} será removido permanentemente.</span>
        </div>
        <div style={{marginBottom:16}}>
          <label style={{fontSize:12,fontWeight:600,color:"var(--sub)",display:"block",marginBottom:6}}>Digite o PIN de administrador para confirmar</label>
          <input
            type="password"
            value={pin}
            onChange={e=>{setPin(e.target.value);setErr("");}}
            onKeyDown={e=>e.key==="Enter"&&submit()}
            placeholder="PIN"
            maxLength={4}
            autoFocus
            style={{width:"100%",padding:"10px 14px",border:`1px solid ${err?"var(--red)":"var(--border2)"}`,borderRadius:"var(--rs)",fontSize:16,letterSpacing:8,background:"var(--bg)",color:"var(--text)",outline:"none",textAlign:"center",boxSizing:"border-box"}}
          />
          {err&&<div style={{color:"var(--red)",fontSize:12,marginTop:6,display:"flex",alignItems:"center",gap:4}}><Icon n="error_outline" s={14} c="var(--red)"/>{err}</div>}
        </div>
        <div style={{display:"flex",gap:10}}>
          <Btn v="o" style={{flex:1}} onClick={onClose}>Cancelar</Btn>
          <button onClick={submit}
            style={{flex:1,padding:"10px 16px",background:"var(--red)",border:"none",borderRadius:"var(--rs)",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,transition:"all .15s"}}
            onMouseEnter={e=>e.currentTarget.style.opacity=".85"}
            onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
            <Icon n="delete_forever" s={16} c="#fff"/>Excluir membro
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══ ALERTS ════════════════════════════════════════════════════════════════ */
function Alts({alerts,onMarkAll,onAlert}){
  const unread=alerts.filter(a=>!a.read).length;
  return(
    <div className="pp fu">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <h1 style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:22}}>Alertas</h1>
          <p style={{fontSize:13,color:"var(--sub)",marginTop:3}}>{unread} nao lidos</p>
        </div>
        {unread>0&&<Btn v="o" sz="s" onClick={onMarkAll}><Icon n="done_all" s={20}/>Marcar como lidos</Btn>}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {alerts.map((al,i)=>(
          <div key={al.id} onClick={()=>onAlert(al)}
            style={{background:al.read?"var(--surface)":TB[al.type],border:`1px solid ${al.read?"var(--border)":TBR[al.type]}`,borderRadius:"var(--r)",boxShadow:"var(--sh)",padding:"14px 18px",display:"flex",gap:12,alignItems:"flex-start",cursor:al.link?"pointer":"default",opacity:al.read?.65:1,animation:`fadeUp ${.12+i*.04}s ease`,transition:"box-shadow .15s"}}
            onMouseEnter={e=>{if(al.link)e.currentTarget.style.boxShadow="var(--shm)";}}
            onMouseLeave={e=>e.currentTarget.style.boxShadow="var(--sh)"}>
            <div style={{width:38,height:38,borderRadius:"50%",background:al.read?"var(--bg)":TB[al.type],border:`1px solid ${al.read?"var(--border)":"transparent"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Icon n={TI[al.type]} s={20} c={TC[al.type]}/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:600,fontSize:14,lineHeight:1.3,marginBottom:4}}>{al.title}</div>
              <div style={{color:"var(--sub)",fontSize:13,lineHeight:1.5}}>{al.body}</div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:8}}>
                <span style={{fontSize:11,color:"var(--muted)",display:"flex",alignItems:"center",gap:3}}>
                  <Icon n="schedule" s={13} c="var(--muted)"/>{al.time}
                </span>
                {al.link&&<span style={{fontSize:11,color:"var(--accent)",fontWeight:600,display:"flex",alignItems:"center",gap:2}}>
                  Ver detalhes<Icon n="arrow_forward" s={13} c="var(--accent)"/>
                </span>}
              </div>
            </div>
            {!al.read&&(
              <button onClick={e=>{e.stopPropagation();onAlert({...al,read:true});}}
                style={{flexShrink:0,background:"rgba(255,255,255,.45)",border:"1px solid rgba(255,255,255,.7)",borderRadius:"var(--rs)",padding:"6px 14px",cursor:"pointer",fontSize:12,fontWeight:700,color:"var(--text)",display:"flex",alignItems:"center",gap:4,transition:"all .15s",alignSelf:"flex-start"}}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.8)"}
                onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.45)"}>
                <Icon n="check" s={14}/>OK
              </button>
            )}
            {al.read&&<div style={{flexShrink:0,fontSize:11,color:"var(--muted)",display:"flex",alignItems:"center",gap:3,alignSelf:"flex-start"}}><Icon n="check_circle" s={14} c="var(--accent)"/>Lido</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══ SECTORS MODAL ═══════════════════════════════════════════════════════ */
function SectorsModal({ sectors, setSectors, onClose }) {
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null); // {id, name}
  const [err, setErr] = useState("");

  const addSector = () => {
    const n = name.trim();
    if (!n) { setErr("Nome obrigatório."); return; }
    if (sectors.find(s=>s.name.toLowerCase()===n.toLowerCase())) { setErr("Setor já existe."); return; }
    setSectors(p=>[...p,{id:"sec"+Date.now(),name:n}]);
    setName(""); setErr("");
  };

  const saveSector = () => {
    if (!editing?.name.trim()) return;
    setSectors(p=>p.map(s=>s.id===editing.id?{...s,name:editing.name.trim()}:s));
    setEditing(null);
  };

  const delSector = (id) => setSectors(p=>p.filter(s=>s.id!==id));

  return (
    <Ov onClick={onClose}>
      <Sheet onClick={e=>e.stopPropagation()} style={{maxWidth:440}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:36,height:36,borderRadius:"var(--rs)",background:"var(--bbg)",border:"1px solid #bfdbfe",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Icon n="category" s={20} c="var(--blue)"/>
            </div>
            <div>
              <div style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:17}}>Setores de Trabalho</div>
              <div style={{fontSize:12,color:"var(--sub)"}}>{sectors.length} setores cadastrados</div>
            </div>
          </div>
          <Btn v="g" sz="s" onClick={onClose} style={{padding:4}}><Icon n="close" s={20}/></Btn>
        </div>
        <Hr/>

        {/* Add new */}
        <div style={{marginTop:16,marginBottom:20}}>
          <Lbl>Novo Setor</Lbl>
          <div style={{display:"flex",gap:8}}>
            <div style={{flex:1,position:"relative"}}>
              <Icon n="add_business" s={17} c="var(--muted)" style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
              <input value={name} onChange={e=>{setName(e.target.value);setErr("");}}
                onKeyDown={e=>e.key==="Enter"&&addSector()}
                placeholder="Ex: Cozinha, Bar, Recepção..."
                style={{width:"100%",background:"var(--bg)",border:"1px solid var(--border2)",borderRadius:"var(--rs)",padding:"10px 12px 10px 34px",color:"var(--text)",fontSize:13,outline:"none"}}
                onFocus={e=>e.target.style.borderColor="var(--blue)"}
                onBlur={e=>e.target.style.borderColor="var(--border2)"}/>
            </div>
            <Btn onClick={addSector} dis={!name.trim()} style={{background:"var(--blue)"}}><Icon n="add" s={18}/>Criar</Btn>
          </div>
          {err&&<div style={{fontSize:12,color:"var(--red)",marginTop:5,display:"flex",alignItems:"center",gap:4}}><Icon n="error_outline" s={14} c="var(--red)"/>{err}</div>}
        </div>

        {/* Existing sectors */}
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {sectors.length===0&&(
            <div style={{textAlign:"center",padding:"24px",color:"var(--muted)",fontSize:13}}>
              <Icon n="category" s={36} c="var(--border2)"/><div style={{marginTop:8}}>Nenhum setor cadastrado.</div>
            </div>
          )}
          {sectors.map((sec,i)=>(
            <div key={sec.id} style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--rs)",padding:"10px 14px",display:"flex",alignItems:"center",gap:10,animation:`fadeUp ${.08+i*.03}s ease`}}>
              <Icon n="corporate_fare" s={18} c="var(--blue)"/>
              {editing?.id===sec.id ? (
                <>
                  <input value={editing.name} onChange={e=>setEditing(p=>({...p,name:e.target.value}))}
                    onKeyDown={e=>{if(e.key==="Enter")saveSector();if(e.key==="Escape")setEditing(null);}}
                    autoFocus
                    style={{flex:1,background:"var(--bg)",border:"1px solid var(--accent)",borderRadius:"var(--rs)",padding:"5px 10px",color:"var(--text)",fontSize:13,outline:"none"}}/>
                  <button onClick={saveSector} style={{background:"var(--abg)",border:"1px solid var(--abr)",borderRadius:4,padding:"4px 10px",color:"var(--accent)",cursor:"pointer",fontSize:12,fontWeight:600}}>OK</button>
                  <button onClick={()=>setEditing(null)} style={{background:"none",border:"none",cursor:"pointer",color:"var(--muted)",display:"flex"}}><Icon n="close" s={18}/></button>
                </>
              ) : (
                <>
                  <span style={{flex:1,fontWeight:500,fontSize:14}}>{sec.name}</span>
                  <button onClick={()=>setEditing({id:sec.id,name:sec.name})}
                    style={{background:"none",border:"none",cursor:"pointer",color:"var(--muted)",display:"flex",padding:4,borderRadius:4,transition:"all .15s"}}
                    onMouseEnter={e=>{e.currentTarget.style.color="var(--blue)";e.currentTarget.style.background="var(--bbg)";}}
                    onMouseLeave={e=>{e.currentTarget.style.color="var(--muted)";e.currentTarget.style.background="none";}}>
                    <Icon n="edit" s={16}/>
                  </button>
                  <button onClick={()=>delSector(sec.id)}
                    style={{background:"none",border:"none",cursor:"pointer",color:"var(--muted)",display:"flex",padding:4,borderRadius:4,transition:"all .15s"}}
                    onMouseEnter={e=>{e.currentTarget.style.color="var(--red)";e.currentTarget.style.background="var(--rbg)";}}
                    onMouseLeave={e=>{e.currentTarget.style.color="var(--muted)";e.currentTarget.style.background="none";}}>
                    <Icon n="delete_outline" s={16}/>
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </Sheet>
    </Ov>
  );
}

/* ═══ EDIT MEMBER MODAL ════════════════════════════════════════════════════ */
function EditMemberModal({ member, sectors, onClose, onSave }) {
  const [firstName, setFirst]   = useState(member.firstName||member.name.split(" ")[0]);
  const [lastName,  setLast]    = useState(member.lastName ||member.name.split(" ").slice(1).join(" "));
  const [email,     setEmail]   = useState(member.email||"");
  const [phone,     setPhone]   = useState(member.phone||"");
  const [role,      setRole]    = useState(member.role||"");
  const [memberRole,setMRole]   = useState(member.memberRole||"base");
  const [sector,    setSector]  = useState(member.sector||"");
  const [errors,    setErrors]  = useState({});

  const av = ((firstName[0]||"")+(lastName[0]||"")).toUpperCase()||member.av;

  const validate = () => {
    const e = {};
    if (!firstName.trim()) e.firstName="Obrigatório";
    if (!lastName.trim())  e.lastName="Obrigatório";
    if (!email.includes("@")||!email.includes(".")) e.email="E-mail inválido";
    if (phone.replace(/\D/g,"").length<8) e.phone="Número inválido";
    return e;
  };

  const save = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const name = firstName.trim()+" "+lastName.trim();
    onSave({ ...member, firstName:firstName.trim(), lastName:lastName.trim(), name, email:email.trim().toLowerCase(), phone:phone.trim(), role:role.trim(), memberRole, sector:sector||null, av });
  };

  const FErr = ({id})=>errors[id]?<div style={{fontSize:11,color:"var(--red)",marginTop:3,display:"flex",alignItems:"center",gap:3}}><Icon n="error_outline" s={12} c="var(--red)"/>{errors[id]}</div>:null;



  return (
    <Ov onClick={onClose}>
      <Sheet onClick={e=>e.stopPropagation()} style={{maxWidth:520}}>
        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <Av v={av} sz={44} bg="var(--abg)" co="var(--accent)"/>
            <div>
              <div style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:17}}>Editar Cadastro</div>
              <div style={{fontSize:12,color:"var(--sub)"}}>{member.name}</div>
            </div>
          </div>
          <Btn v="g" sz="s" onClick={onClose} style={{padding:4}}><Icon n="close" s={20}/></Btn>
        </div>
        <Hr/>

        <div style={{marginTop:16,display:"flex",flexDirection:"column",gap:14}}>
          {/* Name row */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div>
              <Lbl>Nome *</Lbl>
              <input value={firstName} onChange={e=>{setFirst(e.target.value);setErrors(p=>({...p,firstName:""}))}}
                placeholder="Nome" type="text"
                style={{width:"100%",background:"var(--bg)",border:`1px solid ${errors.firstName?"var(--red)":"var(--border2)"}`,borderRadius:"var(--rs)",padding:"10px 12px",color:"var(--text)",fontSize:13,outline:"none"}}
                onFocus={e=>e.target.style.borderColor="var(--accent)"}
                onBlur={e=>e.target.style.borderColor=errors.firstName?"var(--red)":"var(--border2)"}/>
              <FErr id="firstName"/>
            </div>
            <div>
              <Lbl>Sobrenome *</Lbl>
              <input value={lastName} onChange={e=>{setLast(e.target.value);setErrors(p=>({...p,lastName:""}))}}
                placeholder="Sobrenome" type="text"
                style={{width:"100%",background:"var(--bg)",border:`1px solid ${errors.lastName?"var(--red)":"var(--border2)"}`,borderRadius:"var(--rs)",padding:"10px 12px",color:"var(--text)",fontSize:13,outline:"none"}}
                onFocus={e=>e.target.style.borderColor="var(--accent)"}
                onBlur={e=>e.target.style.borderColor=errors.lastName?"var(--red)":"var(--border2)"}/>
              <FErr id="lastName"/>
            </div>
          </div>

          {/* Contact row */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div>
              <Lbl>E-mail *</Lbl>
              <input value={email} onChange={e=>{setEmail(e.target.value);setErrors(p=>({...p,email:""}))}}
                placeholder="email@exemplo.com" type="email"
                style={{width:"100%",background:"var(--bg)",border:`1px solid ${errors.email?"var(--red)":"var(--border2)"}`,borderRadius:"var(--rs)",padding:"10px 12px",color:"var(--text)",fontSize:13,outline:"none"}}
                onFocus={e=>e.target.style.borderColor="var(--accent)"}
                onBlur={e=>e.target.style.borderColor=errors.email?"var(--red)":"var(--border2)"}/>
              <FErr id="email"/>
            </div>
            <div>
              <Lbl>Celular *</Lbl>
              <input value={phone} onChange={e=>{setPhone(e.target.value);setErrors(p=>({...p,phone:""}))}}
                placeholder="(11) 99999-9999" type="tel"
                style={{width:"100%",background:"var(--bg)",border:`1px solid ${errors.phone?"var(--red)":"var(--border2)"}`,borderRadius:"var(--rs)",padding:"10px 12px",color:"var(--text)",fontSize:13,outline:"none"}}
                onFocus={e=>e.target.style.borderColor="var(--accent)"}
                onBlur={e=>e.target.style.borderColor=errors.phone?"var(--red)":"var(--border2)"}/>
              <FErr id="phone"/>
            </div>
          </div>

          {/* Cargo (free text) */}
          <div>
              <Lbl>Cargo / Função</Lbl>
              <input value={role} onChange={e=>{setRole(e.target.value);setErrors(p=>({...p,role:""}))}}
                placeholder="Ex: Cozinheiro, Garçom..." type="text"
                style={{width:"100%",background:"var(--bg)",border:`1px solid ${errors.role?"var(--red)":"var(--border2)"}`,borderRadius:"var(--rs)",padding:"10px 12px",color:"var(--text)",fontSize:13,outline:"none"}}
                onFocus={e=>e.target.style.borderColor="var(--accent)"}
                onBlur={e=>e.target.style.borderColor=errors.role?"var(--red)":"var(--border2)"}/>
              <FErr id="role"/>
            </div>

          {/* Member role — admin members can't be changed here */}
          {!member.admin&&(
            <div>
              <Lbl>Nível de Acesso</Lbl>
              <div style={{display:"flex",gap:8}}>
                {[
                  {id:"base",   label:"Equipe Base",  icon:"badge",              desc:"Executa checklists e tarefas atribuídas"},
                  {id:"leader", label:"Líder",         icon:"military_tech",      desc:"Pode criar checklists e tarefas para seu setor"},
                ].map(opt=>(
                  <button key={opt.id} onClick={()=>setMRole(opt.id)}
                    style={{flex:1,padding:"12px 10px",borderRadius:"var(--rs)",border:memberRole===opt.id?"1.5px solid var(--accent)":"1.5px solid var(--border2)",background:memberRole===opt.id?"var(--abg)":"var(--surface)",cursor:"pointer",transition:"all .15s",textAlign:"left"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                      <Icon n={opt.icon} s={18} c={memberRole===opt.id?"var(--accent)":"var(--muted)"}/>
                      <span style={{fontWeight:600,fontSize:13,color:memberRole===opt.id?"var(--accent)":"var(--text)"}}>{opt.label}</span>
                    </div>
                    <div style={{fontSize:11,color:"var(--sub)",lineHeight:1.4}}>{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sector */}
          {!member.admin&&(
            <div>
              <Lbl>Setor de Trabalho</Lbl>
              <Sel val={sector} onChange={e=>setSector(e.target.value)}>
                <option value="">— Sem setor —</option>
                {sectors.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
              </Sel>
              {sectors.length===0&&<div style={{fontSize:11,color:"var(--muted)",marginTop:4}}>Nenhum setor cadastrado. Crie setores na página de Equipe.</div>}
            </div>
          )}

          {/* Password notice */}
          <div style={{background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"var(--rs)",padding:"10px 14px",fontSize:12,color:"var(--muted)",display:"flex",alignItems:"center",gap:8}}>
            <Icon n="lock_outline" s={16} c="var(--muted)"/>
            A senha do membro não pode ser alterada por aqui. O próprio membro deve redefini-la.
          </div>
        </div>

        <div style={{display:"flex",gap:8,marginTop:20}}>
          <Btn v="o" onClick={onClose} style={{flex:1,justifyContent:"center"}}>Cancelar</Btn>
          <Btn onClick={save} style={{flex:2,justifyContent:"center",padding:"12px"}}><Icon n="save" s={18}/>Salvar Alterações</Btn>
        </div>
      </Sheet>
    </Ov>
  );
}

/* ═══ MY TASKS (equipe — não líderes) ══════════════════════════════════════ */
function MyTasks({ tasks, user, onToggleTask, onAddTask, onDelTask }) {
  const [tab, setTab] = useState("assigned"); // "assigned" | "mine"
  const [search, setSearch] = useState("");

  const PRIO_MAP = {
    high:   { c:"var(--red)",    bg:"var(--rbg)",  label:"Alta",   icon:"keyboard_double_arrow_up" },
    medium: { c:"var(--warn)",   bg:"var(--wbg)",  label:"Média",  icon:"drag_handle" },
    low:    { c:"var(--accent)", bg:"var(--abg)",  label:"Baixa",  icon:"keyboard_double_arrow_down" },
  };

  const assigned  = tasks.filter(t => t.sid === user.id && t.createdBySid !== user.id);
  const selfMade  = tasks.filter(t => t.createdBySid === user.id && t.sid === user.id);
  const current   = (tab === "assigned" ? assigned : selfMade).filter(t =>
    !search.trim() || t.title.toLowerCase().includes(search.toLowerCase()) ||
    (t.desc||"").toLowerCase().includes(search.toLowerCase())
  );



  return (
    <div className="pp fu">
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
        <div>
          <h1 style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:22,display:"flex",alignItems:"center",gap:8}}>
            <Icon n="task_alt" s={24} c="var(--accent)"/>Minhas Tarefas
          </h1>
          <p style={{fontSize:13,color:"var(--sub)",marginTop:3}}>
            {assigned.filter(t=>!t.done).length} atribuídas a mim · {selfMade.filter(t=>!t.done).length} pessoais pendentes
          </p>
        </div>
        {tab==="mine" && (
          <Btn onClick={onAddTask}><Icon n="add" s={18}/>Nova Tarefa</Btn>
        )}
      </div>

      {/* Tab switcher */}
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        <button onClick={()=>setTab("assigned")} style={{flex:1,padding:"9px 12px",border:"none",cursor:"pointer",background:tab==="assigned"?"var(--accent)":"var(--surface)",color:tab==="assigned"?"#fff":"var(--sub)",borderRadius:"var(--rs)",fontWeight:600,fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",gap:6,transition:"all .15s"}}>
          Atribuídas a mim
          <span style={{background:tab==="assigned"?"rgba(255,255,255,.25)":"var(--border)",color:tab==="assigned"?"#fff":"var(--sub)",borderRadius:100,minWidth:18,height:18,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px"}}>{assigned.length}</span>
        </button>
        <button onClick={()=>setTab("mine")} style={{flex:1,padding:"9px 12px",border:"none",cursor:"pointer",background:tab==="mine"?"var(--accent)":"var(--surface)",color:tab==="mine"?"#fff":"var(--sub)",borderRadius:"var(--rs)",fontWeight:600,fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",gap:6,transition:"all .15s"}}>
          Minhas tarefas
          <span style={{background:tab==="mine"?"rgba(255,255,255,.25)":"var(--border)",color:tab==="mine"?"#fff":"var(--sub)",borderRadius:100,minWidth:18,height:18,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px"}}>{selfMade.length}</span>
        </button>
      </div>

      {/* Search */}
      <div style={{position:"relative",marginBottom:16}}>
        <Icon n="search" s={16} c="var(--muted)" style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)","pointerEvents":"none"}}/>
        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Buscar tarefas..."
          style={{width:"100%",padding:"9px 12px 9px 34px",border:"1px solid var(--border2)",borderRadius:"var(--rs)",
            fontSize:13,background:"var(--surface)",color:"var(--text)",boxSizing:"border-box",outline:"none"}}/>
      </div>

      {/* Task list */}
      {current.length === 0 ? (
        <div style={{textAlign:"center",padding:"48px 0",color:"var(--muted)"}}>
          <Icon n={tab==="assigned"?"assignment_ind":"self_improvement"} s={40} c="var(--border2)"/>
          <div style={{marginTop:12,fontSize:14,fontWeight:500}}>
            {tab==="assigned" ? "Nenhuma tarefa atribuída a você" : "Nenhuma tarefa pessoal"}
          </div>
          {tab==="mine" && (
            <Btn onClick={onAddTask} style={{marginTop:16}}><Icon n="add" s={18}/>Criar tarefa</Btn>
          )}
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {current.map((t,i) => {
            const pr = PRIO_MAP[t.priority]||PRIO_MAP.medium;
            const isOwn = t.createdBySid === user.id;
            return (
              <Card key={t.id} style={{
                padding:"14px 16px", position:"relative",
                animation:`fadeUp ${.08+i*.03}s ease`,
                borderLeft:`3px solid ${t.done?"var(--accent)":pr.c}`,
                opacity: t.done ? .75 : 1,
              }}>
                <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                  {/* Checkbox */}
                  <div onClick={()=>onToggleTask(t.id)} style={{width:22,height:22,borderRadius:6,flexShrink:0,cursor:"pointer",background:t.done?"var(--accent)":"var(--surface)",border:`2px solid ${t.done?"var(--accent)":"var(--border2)"}`,display:"flex",alignItems:"center",justifyContent:"center",marginTop:2,transition:"all .15s"}}>
                    {t.done&&<Icon n="check" s={14} c="#fff"/>}
                  </div>
                  {/* Content */}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                      <span style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:14,
                        textDecoration:t.done?"line-through":"none",
                        color:t.done?"var(--muted)":"var(--text)"}}>{t.title}</span>
                      <span style={{fontSize:11,fontWeight:600,color:pr.c,background:pr.bg,
                        borderRadius:100,padding:"2px 8px",display:"flex",alignItems:"center",gap:3}}>
                        <Icon n={pr.icon} s={11} c={pr.c}/>{pr.label}
                      </span>
                      {isOwn ? (
                        <span style={{fontSize:11,fontWeight:600,color:"var(--accent)",background:"var(--abg)",
                          borderRadius:100,padding:"2px 8px"}}>Pessoal</span>
                      ) : (
                        <span style={{fontSize:11,fontWeight:600,color:"var(--blue)",background:"var(--bbg)",
                          borderRadius:100,padding:"2px 8px"}}>Atribuída</span>
                      )}
                    </div>
                    {t.desc&&<div style={{fontSize:12,color:"var(--sub)",marginBottom:6,lineHeight:1.45}}>{t.desc}</div>}
                    <div style={{display:"flex",alignItems:"center",gap:12,fontSize:11,color:"var(--muted)",flexWrap:"wrap"}}>
                      {t.dueDate&&(
                        <span style={{display:"flex",alignItems:"center",gap:3,color:!t.done?"var(--warn)":"var(--muted)"}}>
                          <Icon n="event" s={13} c={!t.done?"var(--warn)":"var(--muted)"}/>Prazo: {t.dueDate}
                        </span>
                      )}
                      <span style={{display:"flex",alignItems:"center",gap:3}}>
                        <Icon n="add_circle_outline" s={12} c="var(--muted)"/>Criada em {t.createdAt}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Delete — only for own tasks */}
                {isOwn && onDelTask && (
                  <button onClick={()=>onDelTask(t.id)}
                    title="Deletar tarefa"
                    style={{position:"absolute",top:10,right:10,background:"none",border:"none",cursor:"pointer",
                      color:"var(--muted)",borderRadius:"var(--rs)",padding:4,display:"flex",alignItems:"center",
                      transition:"all .15s"}}
                    onMouseEnter={e=>{e.currentTarget.style.color="var(--red)";e.currentTarget.style.background="var(--rbg)";}}
                    onMouseLeave={e=>{e.currentTarget.style.color="var(--muted)";e.currentTarget.style.background="none";}}>
                    <Icon n="delete_outline" s={18}/>
                  </button>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}


/* ═══ LEADER TASKS ═════════════════════════════════════════════════════════ */
function LeaderTasks({ tasks, staff, sectors, user, onToggleTask, onAddTask, onDelTask }) {
  const [filterStatus,   setFilterStatus]   = useState("all");
  const [filterAssignee, setFilterAssignee] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [search,         setSearch]         = useState("");
  const [taskTab,        setTaskTab]        = useState("mine"); // "admin" | "mine"

  const PRIO_MAP = {
    high:   { c:"var(--red)",    bg:"var(--rbg)",  label:"Alta",   icon:"keyboard_double_arrow_up" },
    medium: { c:"var(--warn)",   bg:"var(--wbg)",  label:"Média",  icon:"drag_handle" },
    low:    { c:"var(--accent)", bg:"var(--abg)",  label:"Baixa",  icon:"keyboard_double_arrow_down" },
  };

  const getMember = id => staff.find(s=>s.id===id);
  const getSector = id => sectors.find(s=>s.id===id);

  const adminStaff = staff.filter(s => s.admin);
  const adminIds   = adminStaff.map(s => s.id);

  const applyFilters = list => list.filter(t => {
    if (filterStatus==="pending" && t.done)  return false;
    if (filterStatus==="done"    && !t.done) return false;
    if (filterPriority && t.priority!==filterPriority) return false;
    if (filterAssignee && t.sid!==filterAssignee) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!t.title.toLowerCase().includes(q) &&
          !(t.desc||"").toLowerCase().includes(q) &&
          !(getMember(t.sid)?.name||"").toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const adminTasks  = applyFilters(tasks.filter(t => adminIds.includes(t.createdBySid) || (t.sid === user.id && !t.createdBySid)));
  const myTasks     = applyFilters(tasks.filter(t => t.createdBySid === user.id));
  const visible     = taskTab === "admin" ? adminTasks : myTasks;

  const total   = tasks.length;
  const done    = tasks.filter(t=>t.done).length;
  const pending = total - done;
  const pct     = total>0 ? Math.round(done/total*100) : 0;
  const byPrio  = { high:0, medium:0, low:0 };
  tasks.forEach(t=>{ if(byPrio[t.priority]!==undefined) byPrio[t.priority]++; });

  const activeFilters = [filterStatus!=="all",filterAssignee,filterPriority,search.trim()].filter(Boolean).length;
  const clearFilters  = () => { setFilterStatus("all"); setFilterAssignee(""); setFilterPriority(""); setSearch(""); };

  const mySector = getSector(user.sector);

  return (
    <div className="pp fu">
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
        <div>
          <h1 style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:22,display:"flex",alignItems:"center",gap:8}}>
            <Icon n="task_alt" s={24} c="var(--accent)"/>Tarefas Atribuídas
          </h1>
          <p style={{fontSize:13,color:"var(--sub)",marginTop:3}}>
            Tarefas que você criou para{mySector?` o setor ${mySector.name}`:" sua equipe"}
          </p>
        </div>
        <Btn onClick={onAddTask}><Icon n="add" s={18}/>Nova Tarefa</Btn>
      </div>

      {/* Summary cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}>
        {[
          { label:"Total",     value:total,   icon:"assignment",  c:"var(--blue)",   bg:"var(--bbg)" },
          { label:"Pendentes", value:pending, icon:"schedule",    c:"var(--warn)",   bg:"var(--wbg)" },
          { label:"Concluídas",value:done,    icon:"task_alt",    c:"var(--accent)", bg:"var(--abg)" },
          { label:"Conclusão", value:pct+"%", icon:"donut_large", c:pct>=75?"var(--accent)":pct>=40?"var(--warn)":"var(--red)", bg:"var(--surface)" },
        ].map((s,i)=>(
          <Card key={i} style={{padding:"14px 16px"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <div style={{width:32,height:32,borderRadius:8,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Icon n={s.icon} s={18} c={s.c}/>
              </div>
              <span style={{fontSize:11,color:"var(--sub)",fontWeight:500}}>{s.label}</span>
            </div>
            <div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:24,color:s.c}}>{s.value}</div>
          </Card>
        ))}
      </div>

      {/* Progress bar */}
      {total>0&&(
        <Card style={{padding:"14px 16px",marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <span style={{fontSize:12,fontWeight:600,color:"var(--text)"}}>Progresso Geral</span>
            <span style={{fontSize:12,color:"var(--sub)"}}>{done} de {total} concluídas</span>
          </div>
          <div style={{height:10,background:"var(--border)",borderRadius:100,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,var(--accent),var(--sec))",borderRadius:100,transition:"width .4s ease"}}/>
          </div>
          <div style={{display:"flex",gap:16,marginTop:10,flexWrap:"wrap"}}>
            {Object.entries(byPrio).map(([p,n])=>{
              const pr = PRIO_MAP[p];
              return n>0?(
                <span key={p} style={{fontSize:11,display:"flex",alignItems:"center",gap:4,color:pr.c,fontWeight:500}}>
                  <Icon n={pr.icon} s={14} c={pr.c}/>{pr.label}: {n}
                </span>
              ):null;
            })}
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card style={{padding:"14px 16px",marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
          <Icon n="filter_list" s={18} c="var(--blue)"/>
          <span style={{fontSize:13,fontWeight:600}}>Filtros</span>
          {activeFilters>0&&(
            <span style={{fontSize:11,fontWeight:700,color:"var(--blue)",background:"var(--bbg)",borderRadius:100,padding:"2px 8px"}}>{activeFilters} ativo{activeFilters>1?"s":""}</span>
          )}
          {activeFilters>0&&(
            <button onClick={clearFilters} style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",fontSize:12,color:"var(--muted)",display:"flex",alignItems:"center",gap:3}}
              onMouseEnter={e=>e.currentTarget.style.color="var(--red)"}
              onMouseLeave={e=>e.currentTarget.style.color="var(--muted)"}>
              <Icon n="close" s={14}/>Limpar filtros
            </button>
          )}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:8}}>
          <div style={{position:"relative",gridColumn:"span 2"}}>
            <Icon n="search" s={16} c="var(--muted)" style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Buscar tarefa ou responsável..."
              style={{width:"100%",background:"var(--bg)",border:"1px solid var(--border2)",borderRadius:"var(--rs)",padding:"8px 10px 8px 32px",color:"var(--text)",fontSize:12,outline:"none"}}
              onFocus={e=>e.target.style.borderColor="var(--accent)"}
              onBlur={e=>e.target.style.borderColor="var(--border2)"}/>
          </div>
          <Sel val={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
            <option value="all">Todas as tarefas</option>
            <option value="pending">Pendentes</option>
            <option value="done">Concluídas</option>
          </Sel>
          <Sel val={filterPriority} onChange={e=>setFilterPriority(e.target.value)}>
            <option value="">Qualquer prioridade</option>
            <option value="high">Alta</option>
            <option value="medium">Média</option>
            <option value="low">Baixa</option>
          </Sel>
          <Sel val={filterAssignee} onChange={e=>setFilterAssignee(e.target.value)}>
            <option value="">Qualquer responsável</option>
            {staff.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
          </Sel>
        </div>
      </Card>

      {/* Tab switcher */}
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {[
          {id:"mine",  label:"Minhas tarefas",            icon:"person",        count:tasks.filter(t=>t.createdBySid===user.id).length},
          {id:"admin", label:"Atribuídas por admins",     icon:"admin_panel_settings", count:tasks.filter(t=>adminIds.includes(t.createdBySid)).length},
        ].map(tb=>(
          <button key={tb.id} onClick={()=>setTaskTab(tb.id)} style={{
            flex:1, padding:"9px 12px", border:"none", cursor:"pointer",
            background:taskTab===tb.id?"var(--accent)":"var(--surface)",
            color:taskTab===tb.id?"#fff":"var(--sub)",
            borderRadius:"var(--rs)", fontWeight:600, fontSize:13,
            display:"flex", alignItems:"center", justifyContent:"center", gap:6,
            transition:"all .15s",
          }}>
            <Icon n={tb.icon} s={16} c={taskTab===tb.id?"#fff":"var(--sub)"}/>
            {tb.label}
            <span style={{
              background:taskTab===tb.id?"rgba(255,255,255,.25)":"var(--border)",
              color:taskTab===tb.id?"#fff":"var(--sub)",
              borderRadius:100, minWidth:18, height:18, fontSize:10, fontWeight:700,
              display:"flex", alignItems:"center", justifyContent:"center", padding:"0 4px",
            }}>{tb.count}</span>
          </button>
        ))}
      </div>

      {/* Results count */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <div style={{fontSize:12,color:"var(--sub)"}}>
          {visible.length} tarefa{visible.length!==1?"s":""} encontrada{visible.length!==1?"s":""}
          {activeFilters>0&&` (de ${total} no total)`}
        </div>
        {visible.length>0&&(
          <div style={{fontSize:11,color:"var(--sub)",display:"flex",gap:12}}>
            <span style={{color:"var(--warn)",fontWeight:600}}>{visible.filter(t=>!t.done).length} pendente{visible.filter(t=>!t.done).length!==1?"s":""}</span>
            <span style={{color:"var(--accent)",fontWeight:600}}>{visible.filter(t=>t.done).length} concluída{visible.filter(t=>t.done).length!==1?"s":""}</span>
          </div>
        )}
      </div>

      {/* Empty state */}
      {visible.length===0&&(
        <div style={{textAlign:"center",padding:"48px 20px",background:"var(--surface)",border:"1.5px dashed var(--border2)",borderRadius:"var(--r)"}}>
          <Icon n="search_off" s={48} c="var(--border2)"/>
          <div style={{marginTop:12,fontSize:15,fontWeight:600,color:"var(--muted)"}}>
            {visible.length===0&&taskTab==="mine"&&myTasks.length===0?"Nenhuma tarefa criada por você":visible.length===0&&taskTab==="admin"&&adminTasks.length===0?"Nenhuma tarefa atribuída por admins":"Nenhuma tarefa encontrada"}
          </div>
          <div style={{fontSize:12,color:"var(--muted)",marginTop:4}}>
            {taskTab==="mine"&&tasks.filter(t=>t.createdBySid===user.id).length===0?"Crie sua primeira tarefa para a equipe":"Tente ajustar os filtros de busca"}
          </div>
          {total>0&&activeFilters>0&&(
            <button onClick={clearFilters} style={{marginTop:12,background:"none",border:"none",cursor:"pointer",color:"var(--blue)",fontSize:13,fontWeight:600}}>Limpar filtros</button>
          )}
        </div>
      )}

      {/* Task list */}
      {visible.length>0&&(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {visible.map((t,i)=>{
            const assignee  = getMember(t.sid);
            const assignSec = assignee ? getSector(assignee.sector) : null;
            const pr        = PRIO_MAP[t.priority]||PRIO_MAP.medium;

            return (
              <Card key={t.id} style={{
                padding:"14px 16px",
                animation:`fadeUp ${.08+i*.03}s ease`,
                borderLeft:`3px solid ${t.done?"var(--accent)":pr.c}`,
                opacity: t.done ? .75 : 1,
                position:"relative",
              }}>
                <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                  {/* Checkbox — clickable for creator */}
                  <div onClick={()=>onToggleTask(t.id)} style={{width:22,height:22,borderRadius:6,flexShrink:0,cursor:"pointer",background:t.done?"var(--accent)":"var(--surface)",border:`2px solid ${t.done?"var(--accent)":"var(--border2)"}`,display:"flex",alignItems:"center",justifyContent:"center",marginTop:2,transition:"all .15s"}}>
                    {t.done&&<Icon n="check" s={14} c="#fff"/>}
                  </div>

                  {/* Content */}
                  <div style={{flex:1,minWidth:0}}>
                    {/* Title + badges */}
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                      <span style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:14,
                        textDecoration:t.done?"line-through":"none",
                        color:t.done?"var(--muted)":"var(--text)"}}>{t.title}</span>
                      <span style={{fontSize:11,fontWeight:600,color:pr.c,background:pr.bg,
                        borderRadius:100,padding:"2px 8px",display:"flex",alignItems:"center",gap:3}}>
                        <Icon n={pr.icon} s={11} c={pr.c}/>{pr.label}
                      </span>
                      {t.done?(
                        <span style={{fontSize:11,fontWeight:600,color:"var(--accent)",background:"var(--abg)",
                          borderRadius:100,padding:"2px 8px",display:"flex",alignItems:"center",gap:3}}>
                          <Icon n="check_circle" s={11} c="var(--accent)"/>Concluída
                        </span>
                      ):(
                        <span style={{fontSize:11,fontWeight:600,color:"var(--warn)",background:"var(--wbg)",
                          borderRadius:100,padding:"2px 8px",display:"flex",alignItems:"center",gap:3}}>
                          <Icon n="schedule" s={11} c="var(--warn)"/>Pendente
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {t.desc&&(
                      <div style={{fontSize:12,color:"var(--sub)",marginBottom:6,lineHeight:1.45}}>{t.desc}</div>
                    )}

                    {/* Assignee row */}
                    {assignee&&(
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                        <div style={{display:"flex",alignItems:"center",gap:5}}>
                          <Av v={assignee.av} sz={20} bg={t.done?"var(--abg)":"var(--surface)"} co={t.done?"var(--accent)":"#4b5563"}/>
                          <span style={{fontSize:12,fontWeight:600,color:"var(--text)"}}>{assignee.name}</span>
                          {assignee.role&&<span style={{fontSize:11,color:"var(--muted)"}}>{assignee.role}</span>}
                        </div>
                        {assignSec&&(
                          <span style={{fontSize:11,color:"var(--blue)",background:"var(--bbg)",
                            borderRadius:100,padding:"1px 7px",fontWeight:500,display:"flex",alignItems:"center",gap:3}}>
                            <Icon n="corporate_fare" s={11} c="var(--blue)"/>{assignSec.name}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Meta: dates */}
                    <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",fontSize:11,color:"var(--muted)"}}>
                      {t.dueDate&&(
                        <span style={{display:"flex",alignItems:"center",gap:3,
                          color:!t.done?"var(--warn)":"var(--muted)"}}>
                          <Icon n="event" s={13} c={!t.done?"var(--warn)":"var(--muted)"}/>
                          Prazo: {t.dueDate}
                        </span>
                      )}
                      <span style={{display:"flex",alignItems:"center",gap:3}}>
                        <Icon n="add_circle_outline" s={12} c="var(--muted)"/>Criada em {t.createdAt}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Delete button — only for creator */}
                {onDelTask && (t.createdBySid===user.id) && (
                  <button onClick={()=>onDelTask(t.id)}
                    title="Deletar tarefa"
                    style={{position:"absolute",top:10,right:10,background:"none",border:"none",cursor:"pointer",
                      color:"var(--muted)",borderRadius:"var(--rs)",padding:4,display:"flex",alignItems:"center",
                      transition:"all .15s"}}
                    onMouseEnter={e=>{e.currentTarget.style.color="var(--red)";e.currentTarget.style.background="var(--rbg)";}}
                    onMouseLeave={e=>{e.currentTarget.style.color="var(--muted)";e.currentTarget.style.background="none";}}>
                    <Icon n="delete_outline" s={18}/>
                  </button>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══ ADMIN TASKS ══════════════════════════════════════════════════════════ */
function AdminTasks({ tasks, staff, sectors, user, onToggleTask, onDelTask, onAddTask }) {
  const [filterStatus,   setFilterStatus]   = useState("all");    // all | pending | done
  const [filterSector,   setFilterSector]   = useState("");
  const [filterAssignee, setFilterAssignee] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterCreator,  setFilterCreator]  = useState("");
  const [search,         setSearch]         = useState("");

  const PRIO_MAP = {
    high:   { c:"var(--red)",    bg:"var(--rbg)",  label:"Alta",   icon:"keyboard_double_arrow_up" },
    medium: { c:"var(--warn)",   bg:"var(--wbg)",  label:"Média",  icon:"drag_handle" },
    low:    { c:"var(--accent)", bg:"var(--abg)",  label:"Baixa",  icon:"keyboard_double_arrow_down" },
  };

  /* ── helpers ── */
  const getMember  = id => staff.find(s=>s.id===id);
  const getSector  = id => sectors.find(s=>s.id===id);

  /* ── leaders = staff with memberRole==="leader" ── */
  const leaders = staff.filter(s=>s.memberRole==="leader"&&s.status==="approved");

  /* ── filter chain ── */
  const visible = tasks.filter(t => {
    if (filterStatus==="pending" && t.done)  return false;
    if (filterStatus==="done"    && !t.done) return false;
    if (filterPriority && t.priority!==filterPriority) return false;
    if (filterCreator  && t.createdBySid!==filterCreator) return false;
    if (filterAssignee && t.sid!==filterAssignee) return false;
    if (filterSector) {
      const assignee = getMember(t.sid);
      if (!assignee || assignee.sector!==filterSector) return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const title = t.title.toLowerCase();
      const desc  = (t.desc||"").toLowerCase();
      const name  = (getMember(t.sid)?.name||"").toLowerCase();
      if (!title.includes(q)&&!desc.includes(q)&&!name.includes(q)) return false;
    }
    return true;
  });

  /* ── stats ── */
  const total   = tasks.length;
  const done    = tasks.filter(t=>t.done).length;
  const pending = total - done;
  const pct     = total>0 ? Math.round(done/total*100) : 0;
  const byPrio  = { high:0, medium:0, low:0 };
  tasks.forEach(t=>{ if(byPrio[t.priority]!==undefined) byPrio[t.priority]++; });

  const activeFilters = [filterStatus!=="all",filterSector,filterAssignee,filterPriority,filterCreator,search.trim()].filter(Boolean).length;
  const clearFilters  = () => { setFilterStatus("all"); setFilterSector(""); setFilterAssignee(""); setFilterPriority(""); setFilterCreator(""); setSearch(""); };

  /* ── sector group label ── */
  const groupedBySector = {};
  visible.forEach(t => {
    const assignee = getMember(t.sid);
    const sId = assignee?.sector || "__none__";
    if (!groupedBySector[sId]) groupedBySector[sId] = [];
    groupedBySector[sId].push(t);
  });

  return (
    <div className="pp fu">
      {/* ── Page header ── */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
        <div>
          <h1 style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:22,display:"flex",alignItems:"center",gap:8}}>
            <Icon n="task_alt" s={24} c="var(--accent)"/>Tarefas Atribuídas
          </h1>
          <p style={{fontSize:13,color:"var(--sub)",marginTop:3}}>
            Visão geral de todas as tarefas criadas por líderes e administradores
          </p>
        </div>
        <Btn onClick={onAddTask}><Icon n="add" s={18}/>Nova Tarefa</Btn>
      </div>

      {/* ── Summary cards ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}>
        {[
          { label:"Total",     value:total,   icon:"assignment",       c:"var(--blue)",   bg:"var(--bbg)" },
          { label:"Pendentes", value:pending, icon:"schedule",         c:"var(--warn)",   bg:"var(--wbg)" },
          { label:"Concluídas",value:done,    icon:"task_alt",         c:"var(--accent)", bg:"var(--abg)" },
          { label:"Conclusão", value:pct+"%", icon:"donut_large",      c:pct>=75?"var(--accent)":pct>=40?"var(--warn)":"var(--red)", bg:"var(--surface)" },
        ].map((s,i)=>(
          <Card key={i} style={{padding:"14px 16px"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <div style={{width:32,height:32,borderRadius:8,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Icon n={s.icon} s={18} c={s.c}/>
              </div>
              <span style={{fontSize:11,color:"var(--sub)",fontWeight:500}}>{s.label}</span>
            </div>
            <div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:24,color:s.c}}>{s.value}</div>
          </Card>
        ))}
      </div>

      {/* ── Progress bar global ── */}
      {total>0&&(
        <Card style={{padding:"14px 16px",marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <span style={{fontSize:12,fontWeight:600,color:"var(--text)"}}>Progresso Geral</span>
            <span style={{fontSize:12,color:"var(--sub)"}}>{done} de {total} concluídas</span>
          </div>
          <div style={{height:10,background:"var(--border)",borderRadius:100,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,var(--accent),var(--sec))`,borderRadius:100,transition:"width .4s ease"}}/>
          </div>
          <div style={{display:"flex",gap:16,marginTop:10,flexWrap:"wrap"}}>
            {Object.entries(byPrio).map(([p,n])=>{
              const pr = PRIO_MAP[p];
              return n>0?(
                <span key={p} style={{fontSize:11,display:"flex",alignItems:"center",gap:4,color:pr.c,fontWeight:500}}>
                  <Icon n={pr.icon} s={14} c={pr.c}/>{pr.label}: {n}
                </span>
              ):null;
            })}
          </div>
        </Card>
      )}

      {/* ── Filters ── */}
      <Card style={{padding:"14px 16px",marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
          <Icon n="filter_list" s={18} c="var(--blue)"/>
          <span style={{fontSize:13,fontWeight:600}}>Filtros</span>
          {activeFilters>0&&(
            <span style={{fontSize:11,fontWeight:700,color:"var(--blue)",background:"var(--bbg)",borderRadius:100,padding:"2px 8px"}}>{activeFilters} ativo{activeFilters>1?"s":""}</span>
          )}
          {activeFilters>0&&(
            <button onClick={clearFilters} style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",fontSize:12,color:"var(--muted)",display:"flex",alignItems:"center",gap:3}}
              onMouseEnter={e=>e.currentTarget.style.color="var(--red)"}
              onMouseLeave={e=>e.currentTarget.style.color="var(--muted)"}>
              <Icon n="close" s={14}/>Limpar filtros
            </button>
          )}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:8}}>
          {/* Search */}
          <div style={{position:"relative",gridColumn:"span 2"}}>
            <Icon n="search" s={16} c="var(--muted)" style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Buscar tarefa ou responsável..."
              style={{width:"100%",background:"var(--bg)",border:"1px solid var(--border2)",borderRadius:"var(--rs)",padding:"8px 10px 8px 32px",color:"var(--text)",fontSize:12,outline:"none"}}
              onFocus={e=>e.target.style.borderColor="var(--accent)"}
              onBlur={e=>e.target.style.borderColor="var(--border2)"}/>
          </div>
          {/* Status */}
          <Sel val={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
            <option value="all">Todas as tarefas</option>
            <option value="pending">Pendentes</option>
            <option value="done">Concluídas</option>
          </Sel>
          {/* Priority */}
          <Sel val={filterPriority} onChange={e=>setFilterPriority(e.target.value)}>
            <option value="">Qualquer prioridade</option>
            <option value="high">Alta</option>
            <option value="medium">Média</option>
            <option value="low">Baixa</option>
          </Sel>
          {/* Sector */}
          {sectors.length>0&&(
            <Sel val={filterSector} onChange={e=>setFilterSector(e.target.value)}>
              <option value="">Todos os setores</option>
              {sectors.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
            </Sel>
          )}
          {/* Creator (leader) */}
          {leaders.length>0&&(
            <Sel val={filterCreator} onChange={e=>setFilterCreator(e.target.value)}>
              <option value="">Qualquer criador</option>
              <option value="__admin__">Administrador</option>
              {leaders.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}
            </Sel>
          )}
          {/* Assignee */}
          <Sel val={filterAssignee} onChange={e=>setFilterAssignee(e.target.value)}>
            <option value="">Qualquer responsável</option>
            {staff.filter(s=>!s.admin&&s.status==="approved").map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
          </Sel>
        </div>
      </Card>

      {/* ── Results count ── */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <div style={{fontSize:12,color:"var(--sub)"}}>
          {visible.length} tarefa{visible.length!==1?"s":""} encontrada{visible.length!==1?"s":""}
          {activeFilters>0&&` (de ${total} no total)`}
        </div>
        {visible.length>0&&(
          <div style={{fontSize:11,color:"var(--sub)",display:"flex",gap:12}}>
            <span style={{color:"var(--warn)",fontWeight:600}}>{visible.filter(t=>!t.done).length} pendente{visible.filter(t=>!t.done).length!==1?"s":""}</span>
            <span style={{color:"var(--accent)",fontWeight:600}}>{visible.filter(t=>t.done).length} concluída{visible.filter(t=>t.done).length!==1?"s":""}</span>
          </div>
        )}
      </div>

      {/* ── Empty state ── */}
      {visible.length===0&&(
        <div style={{textAlign:"center",padding:"48px 20px",background:"var(--surface)",border:"1.5px dashed var(--border2)",borderRadius:"var(--r)"}}>
          <Icon n="search_off" s={48} c="var(--border2)"/>
          <div style={{marginTop:12,fontSize:15,fontWeight:600,color:"var(--muted)"}}>
            {total===0?"Nenhuma tarefa criada ainda":"Nenhuma tarefa encontrada"}
          </div>
          <div style={{fontSize:12,color:"var(--muted)",marginTop:4}}>
            {total===0?"Crie tarefas ou aguarde que líderes atribuam para suas equipes":"Tente ajustar os filtros de busca"}
          </div>
          {total===0&&<Btn onClick={onAddTask} style={{marginTop:16,justifyContent:"center"}}><Icon n="add" s={18}/>Nova Tarefa</Btn>}
          {total>0&&activeFilters>0&&<button onClick={clearFilters} style={{marginTop:12,background:"none",border:"none",cursor:"pointer",color:"var(--blue)",fontSize:13,fontWeight:600}}>Limpar filtros</button>}
        </div>
      )}

      {/* ── Task list ── */}
      {visible.length>0&&(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {visible.map((t,i)=>{
            const assignee  = getMember(t.sid);
            const creator   = t.createdBySid ? getMember(t.createdBySid) : null;
            const creatorSec= creator ? getSector(creator.sector) : null;
            const assignSec = assignee ? getSector(assignee.sector) : null;
            const pr        = PRIO_MAP[t.priority]||PRIO_MAP.medium;
            const isOverdue = t.dueDate && !t.done;

            return (
              <Card key={t.id} style={{
                padding:"14px 16px",
                animation:`fadeUp ${.08+i*.03}s ease`,
                borderLeft:`3px solid ${t.done?"var(--accent)":pr.c}`,
                opacity: t.done ? .75 : 1,
              }}>
                <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                  {/* Checkbox */}
                  <div onClick={()=>onToggleTask(t.id)} style={{width:22,height:22,borderRadius:6,flexShrink:0,cursor:"pointer",background:t.done?"var(--accent)":"var(--surface)",border:`2px solid ${t.done?"var(--accent)":"var(--border2)"}`,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s",marginTop:2}}>
                    {t.done&&<Icon n="check" s={14} c="#fff"/>}
                  </div>

                  {/* Content */}
                  <div style={{flex:1,minWidth:0}}>
                    {/* Title row */}
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                      <span style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:14,
                        textDecoration:t.done?"line-through":"none",
                        color:t.done?"var(--muted)":"var(--text)"}}>{t.title}</span>
                      <span style={{fontSize:11,fontWeight:600,color:pr.c,background:pr.bg,
                        borderRadius:100,padding:"2px 8px",display:"flex",alignItems:"center",gap:3}}>
                        <Icon n={pr.icon} s={11} c={pr.c}/>{pr.label}
                      </span>
                      {t.done&&(
                        <span style={{fontSize:11,fontWeight:600,color:"var(--accent)",background:"var(--abg)",
                          borderRadius:100,padding:"2px 8px",display:"flex",alignItems:"center",gap:3}}>
                          <Icon n="check_circle" s={11} c="var(--accent)"/>Concluída
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {t.desc&&(
                      <div style={{fontSize:12,color:"var(--sub)",marginBottom:6,lineHeight:1.45,
                        paddingLeft:0}}>{t.desc}</div>
                    )}

                    {/* Assignee + Creator row */}
                    <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap",
                      fontSize:12,marginBottom:6}}>
                      {/* Assignee */}
                      {assignee&&(
                        <div style={{display:"flex",alignItems:"center",gap:5}}>
                          <Av v={assignee.av} sz={20} bg="var(--surface)" co="#4b5563"/>
                          <div>
                            <span style={{fontWeight:600,color:"var(--text)"}}>{assignee.name}</span>
                            {assignee.role&&<span style={{color:"var(--muted)",marginLeft:4,fontSize:11}}>{assignee.role}</span>}
                          </div>
                          {assignSec&&(
                            <span style={{fontSize:11,color:"var(--blue)",background:"var(--bbg)",
                              borderRadius:100,padding:"1px 7px",fontWeight:500,display:"flex",alignItems:"center",gap:3}}>
                              <Icon n="corporate_fare" s={11} c="var(--blue)"/>{assignSec.name}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Creator */}
                      <div style={{display:"flex",alignItems:"center",gap:4,color:"var(--muted)",
                        borderLeft:"1px solid var(--border)",paddingLeft:12}}>
                        <Icon n={creator?"military_tech":"admin_panel_settings"} s={13} c="var(--muted)"/>
                        <span style={{fontSize:11}}>
                          {creator ? `Por ${creator.name}` : "Por Admin"}
                          {creatorSec&&<span style={{marginLeft:4,color:"var(--blue)"}}>· {creatorSec.name}</span>}
                        </span>
                      </div>
                    </div>

                    {/* Meta row: dates */}
                    <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",fontSize:11,color:"var(--muted)"}}>
                      {t.dueDate&&(
                        <span style={{display:"flex",alignItems:"center",gap:3,
                          color:isOverdue?"var(--warn)":"var(--muted)"}}>
                          <Icon n="event" s={13} c={isOverdue?"var(--warn)":"var(--muted)"}/>
                          Prazo: {t.dueDate}
                          {isOverdue&&<Icon n="warning_amber" s={12} c="var(--warn)"/>}
                        </span>
                      )}
                      <span style={{display:"flex",alignItems:"center",gap:3}}>
                        <Icon n="add_circle_outline" s={12} c="var(--muted)"/>Criada em {t.createdAt}
                      </span>
                    </div>
                  </div>

                  {/* Delete — only creator */}
                  {onDelTask && t.createdBySid===user.id && (
                    <button onClick={()=>onDelTask(t.id)}
                      style={{background:"none",border:"none",cursor:"pointer",color:"var(--muted)",
                        display:"flex",alignItems:"center",padding:4,borderRadius:4,
                        transition:"all .15s",flexShrink:0}}
                      onMouseEnter={e=>{e.currentTarget.style.color="var(--red)";e.currentTarget.style.background="var(--rbg)";}}
                      onMouseLeave={e=>{e.currentTarget.style.color="var(--muted)";e.currentTarget.style.background="none";}}>
                      <Icon n="delete_outline" s={18}/>
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══ ADD TASK MODAL ═══════════════════════════════════════════════════════ */
function AddTaskModal({ staff, onClose, onAdd }) {
  const [title,   setTitle]  = useState("");
  const [desc,    setDesc]   = useState("");
  const [sid,     setSid]    = useState(staff[0]?.id ?? "");
  const [priority,setPriority]= useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [err,     setErr]    = useState("");

  const PRIORITIES = [
    { id:"high",   label:"Alta",  icon:"keyboard_double_arrow_up",   c:"var(--red)",    bg:"var(--rbg)" },
    { id:"medium", label:"Média", icon:"drag_handle",                 c:"var(--warn)",   bg:"var(--wbg)" },
    { id:"low",    label:"Baixa", icon:"keyboard_double_arrow_down",  c:"var(--accent)", bg:"var(--abg)" },
  ];

  const submit = () => {
    if (!title.trim()) { setErr("Título é obrigatório."); return; }
    if (!sid)          { setErr("Selecione um responsável."); return; }
    onAdd({ title: title.trim(), desc: desc.trim(), sid, priority, dueDate });
  };

  return (
    <Ov onClick={onClose}>
      <Sheet onClick={e=>e.stopPropagation()} style={{maxWidth:480}}>
        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:36,height:36,borderRadius:"var(--rs)",background:"var(--abg)",border:"1px solid var(--abr)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Icon n="task_alt" s={20} c="var(--accent)"/>
            </div>
            <div>
              <div style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:17}}>Nova Tarefa Avulsa</div>
              <div style={{fontSize:12,color:"var(--sub)"}}>Atribuir tarefa a um membro da equipe</div>
            </div>
          </div>
          <Btn v="g" sz="s" onClick={onClose} style={{padding:4}}><Icon n="close" s={20}/></Btn>
        </div>
        <Hr/>

        {/* Title */}
        <div style={{marginTop:16}}>
          <Lbl>Título *</Lbl>
          <div style={{position:"relative"}}>
            <Icon n="edit_note" s={17} c="var(--muted)" style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
            <input value={title} onChange={e=>{setTitle(e.target.value);setErr("");}}
              placeholder="Ex: Verificar estoque de bebidas"
              style={{width:"100%",background:"var(--bg)",border:"1px solid var(--border2)",borderRadius:"var(--rs)",padding:"10px 12px 10px 34px",color:"var(--text)",fontSize:13,outline:"none"}}
              onFocus={e=>e.target.style.borderColor="var(--accent)"}
              onBlur={e=>e.target.style.borderColor="var(--border2)"}
              onKeyDown={e=>e.key==="Enter"&&submit()}
              autoFocus/>
          </div>
        </div>

        {/* Description */}
        <div style={{marginTop:14}}>
          <Lbl>Descrição <span style={{fontWeight:400,color:"var(--muted)"}}>(opcional)</span></Lbl>
          <textarea value={desc} onChange={e=>setDesc(e.target.value)}
            placeholder="Instruções adicionais..."
            rows={3}
            style={{width:"100%",background:"var(--bg)",border:"1px solid var(--border2)",borderRadius:"var(--rs)",padding:"10px 12px",color:"var(--text)",fontSize:13,outline:"none",resize:"vertical",fontFamily:"inherit",lineHeight:1.5}}
            onFocus={e=>e.target.style.borderColor="var(--accent)"}
            onBlur={e=>e.target.style.borderColor="var(--border2)"}/>
        </div>

        {/* Assignee + Due date row */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:14}}>
          <div>
            <Lbl>Responsável *</Lbl>
            <Sel val={sid} onChange={e=>setSid(e.target.value)}>
              {staff.map(s=><option key={s.id} value={s.id}>{s.name} — {s.role}</option>)}
            </Sel>
          </div>
          <div>
            <Lbl>Prazo <span style={{fontWeight:400,color:"var(--muted)"}}>(opcional)</span></Lbl>
            <div style={{position:"relative"}}>
              <Icon n="event" s={16} c="var(--muted)" style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
              <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)}
                style={{width:"100%",background:"var(--bg)",border:"1px solid var(--border2)",borderRadius:"var(--rs)",padding:"10px 12px 10px 32px",color:"var(--text)",fontSize:13,outline:"none"}}
                onFocus={e=>e.target.style.borderColor="var(--accent)"}
                onBlur={e=>e.target.style.borderColor="var(--border2)"}/>
            </div>
          </div>
        </div>

        {/* Priority */}
        <div style={{marginTop:14}}>
          <Lbl>Prioridade</Lbl>
          <div style={{display:"flex",gap:8}}>
            {PRIORITIES.map(p=>(
              <button key={p.id} onClick={()=>setPriority(p.id)}
                style={{flex:1,padding:"9px 6px",borderRadius:"var(--rs)",border:priority===p.id?`1.5px solid ${p.c}`:"1.5px solid var(--border2)",background:priority===p.id?p.bg:"var(--surface)",color:priority===p.id?p.c:"var(--sub)",fontWeight:600,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5,transition:"all .15s"}}>
                <Icon n={p.icon} s={16} c={priority===p.id?p.c:"var(--sub)"}/>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {err&&(
          <div style={{marginTop:12,background:"var(--rbg)",border:"1px solid var(--rbr)",borderRadius:"var(--rs)",padding:"9px 12px",fontSize:12,color:"var(--red)",display:"flex",alignItems:"center",gap:6}}>
            <Icon n="error_outline" s={16} c="var(--red)"/>{err}
          </div>
        )}

        {/* Actions */}
        <div style={{display:"flex",gap:8,marginTop:20}}>
          <Btn v="o" onClick={onClose} style={{flex:1,justifyContent:"center"}}><Icon n="close" s={18}/>Cancelar</Btn>
          <Btn onClick={submit} dis={!title.trim()||!sid} style={{flex:2,justifyContent:"center",padding:"12px"}}><Icon n="task_alt" s={18}/>Criar Tarefa</Btn>
        </div>
      </Sheet>
    </Ov>
  );
}

/* ═══ ADD CHECKLIST ════════════════════════════════════════════════════════ */
function AddCl({staff,tpls,pre,onClose,onAdd}){
  const [tid,     setTid]    = useState(pre||(tpls[0]?.id??""));
  const [sid,     setSid]    = useState(staff[0]?.id??"");
  const [freq,    setFreq]   = useState("daily");
  const [days,    setDays]   = useState([]);
  const [dueTime, setDueTime]= useState("08:00");
  const tpl = tpls.find(t=>t.id===tid);
  const freqOpt = FREQ_OPTS.find(f=>f.id===freq);
  const needsDays = freqOpt?.hasDays;
  const minDays = freq==="twice_week"?2:freq==="three_week"?3:1;
  const daysOk = !needsDays || days.length>=minDays;
  const toggleDay = d => setDays(p=>p.includes(d)?p.filter(x=>x!==d):[...p,d].sort());

  return(
    <Ov onClick={onClose}>
      <Sheet onClick={e=>e.stopPropagation()} style={{maxWidth:540}}>
        <div style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:18,marginBottom:4,display:"flex",alignItems:"center",gap:8}}>
          <Icon n="add_task" s={22} c="var(--accent)"/>Novo Checklist
        </div>
        <div style={{fontSize:13,color:"var(--sub)",marginBottom:18}}>Configure template, responsavel e recorrencia</div>

        <Lbl>Template</Lbl>
        <Sel val={tid} onChange={e=>setTid(e.target.value)}>
          {tpls.map(t=><option key={t.id} value={t.id}>{t.icon} {t.name}</option>)}
        </Sel>
        {tpl&&(
          <div style={{marginTop:8,background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"var(--rs)",padding:"10px 12px"}}>
            <div style={{fontSize:11,fontWeight:600,color:"var(--sub)",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>
              Itens incluidos ({tpl.items.length})
            </div>
            {tpl.items.slice(0,4).map((it,i)=>(
              <div key={i} style={{fontSize:12,color:"var(--sub)",marginBottom:2,display:"flex",gap:6}}>
                <Icon n="check" s={13} c="var(--muted)" style={{marginTop:1,flexShrink:0}}/>{it}
              </div>
            ))}
            {tpl.items.length>4&&<div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>+{tpl.items.length-4} itens...</div>}
          </div>
        )}

        <Lbl>Responsavel</Lbl>
        <Sel val={sid} onChange={e=>setSid(e.target.value)}>
          {staff.map(s=><option key={s.id} value={s.id}>{s.name} — {s.role}</option>)}
        </Sel>

        <Lbl>Horario limite para conclusao</Lbl>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{position:"relative",flex:"0 0 140px"}}>
            <Icon n="schedule" s={17} c="var(--muted)" style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
            <input type="time" value={dueTime} onChange={e=>setDueTime(e.target.value)}
              style={{width:"100%",background:"var(--bg)",border:"1px solid var(--border2)",borderRadius:"var(--rs)",padding:"10px 12px 10px 34px",color:"var(--text)",fontSize:13,outline:"none"}}
              onFocus={e=>e.target.style.borderColor="var(--accent)"}
              onBlur={e=>e.target.style.borderColor="var(--border2)"}/>
          </div>
          <div style={{fontSize:12,color:"var(--sub)",lineHeight:1.4}}>
            Se nao concluido no prazo, todos os admins recebem aviso por e-mail.
          </div>
        </div>

        <Lbl>Frequencia de reinicio</Lbl>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginTop:4}}>
          {FREQ_OPTS.map(f=>(
            <button key={f.id} onClick={()=>{setFreq(f.id);setDays([]);}}
              style={{padding:"10px 6px",borderRadius:"var(--rs)",border:freq===f.id?"1.5px solid var(--accent)":"1.5px solid var(--border2)",background:freq===f.id?"var(--abg)":"var(--surface)",color:freq===f.id?"var(--accent)":"var(--sub)",fontWeight:600,fontSize:11,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:5,transition:"all .15s",lineHeight:1.3}}>
              <Icon n={f.icon} s={20} c={freq===f.id?"var(--accent)":"var(--muted)"}/>
              {f.label}
            </button>
          ))}
        </div>

        {needsDays&&(
          <div style={{marginTop:14}}>
            <div style={{fontSize:12,fontWeight:600,color:"var(--sub)",marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
              <Icon n="event_note" s={15} c="var(--sub)"/>
              {freq==="twice_week"?"Escolha 2 dias":freq==="three_week"?"Escolha 3 dias":"Escolha os dias"}
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {WEEKDAYS.map(d=>(
                <button key={d.id} onClick={()=>toggleDay(d.id)}
                  style={{width:44,height:44,borderRadius:"50%",border:days.includes(d.id)?"2px solid var(--accent)":"1.5px solid var(--border2)",background:days.includes(d.id)?"var(--accent)":"var(--surface)",color:days.includes(d.id)?"#fff":"var(--sub)",fontWeight:600,fontSize:12,cursor:"pointer",transition:"all .15s",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {d.short}
                </button>
              ))}
            </div>
            {needsDays&&days.length>0&&minDays>days.length&&(
              <div style={{fontSize:11,color:"var(--warn)",marginTop:6,display:"flex",alignItems:"center",gap:4}}>
                <Icon n="info" s={13} c="var(--warn)"/>
                Selecione mais {minDays-days.length} dia{minDays-days.length!==1?"s":""}
              </div>
            )}
          </div>
        )}

        {daysOk&&(
          <div style={{marginTop:12,background:"var(--abg)",border:"1px solid var(--abr)",borderRadius:"var(--rs)",padding:"10px 14px",fontSize:12,color:"var(--accent)",display:"flex",alignItems:"center",gap:7}}>
            <Icon n="autorenew" s={16} c="var(--accent)"/>
            Reinicia <strong style={{marginLeft:4}}>{FREQ_LABEL(freq,days)}</strong>
            <span style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:4,color:"var(--sub)"}}>
              <Icon n="schedule" s={14} c="var(--sub)"/>Prazo: <strong>{dueTime}</strong>
            </span>
          </div>
        )}

        <Btn onClick={()=>onAdd(tid,sid,freq,days,dueTime)} dis={!tid||!sid||!daysOk}
          style={{width:"100%",justifyContent:"center",marginTop:18,padding:"13px"}}>
          <Icon n="check" s={20}/>Criar Checklist
        </Btn>
      </Sheet>
    </Ov>
  );
}

/* ═══ NEW TEMPLATE ══════════════════════════════════════════════════════════ */
function NewTpl({onClose,onCreate}){
  const [name,setName]=useState("");
  const [icon,setIcon]=useState("📋");
  const [cat,setCat]=useState("Operacional");
  const [items,setItems]=useState(["",""]);
  const [picker,setPicker]=useState(false);
  const setIt=(i,v)=>setItems(p=>p.map((x,idx)=>idx===i?v:x));
  const addRow=()=>setItems(p=>[...p,""]);
  const remRow=i=>setItems(p=>p.filter((_,idx)=>idx!==i));
  const valid=name.trim()&&items.filter(i=>i.trim()).length>=1;
  return(
    <Ov onClick={onClose}>
      <Sheet onClick={e=>e.stopPropagation()}>
        <div style={{fontFamily:"var(--fh)",fontWeight:600,fontSize:18,marginBottom:18,display:"flex",alignItems:"center",gap:8}}>
          <Icon n="view_quilt" s={22} c="var(--accent)"/>Novo Template
        </div>
        <div style={{display:"flex",gap:10,alignItems:"flex-end"}}>
          <div>
            <Lbl>Icone</Lbl>
            <button onClick={()=>setPicker(!picker)} style={{marginTop:5,fontSize:22,background:"var(--bg)",border:"1px solid var(--border2)",borderRadius:"var(--rs)",padding:"9px 13px",cursor:"pointer"}}>{icon}</button>
          </div>
          <div style={{flex:1}}>
            <Lbl>Nome</Lbl>
            <Inp val={name} onChange={e=>setName(e.target.value)} ph="Ex: Pre-abertura do bar"/>
          </div>
        </div>
        {picker&&(
          <div style={{marginTop:10,background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"var(--rs)",padding:12,display:"flex",flexWrap:"wrap",gap:6}}>
            {EMOJIS.map(ic=>(
              <button key={ic} onClick={()=>{setIcon(ic);setPicker(false);}} style={{fontSize:20,background:icon===ic?"var(--abg)":"none",border:icon===ic?"1px solid var(--accent)":"1px solid transparent",borderRadius:6,padding:"4px 7px",cursor:"pointer"}}>{ic}</button>
            ))}
          </div>
        )}
        <Lbl>Categoria</Lbl>
        <Sel val={cat} onChange={e=>setCat(e.target.value)}>
          {CATS.map(c=><option key={c}>{c}</option>)}
        </Sel>
        <Lbl>Itens do checklist</Lbl>
        <div style={{display:"flex",flexDirection:"column",gap:7,marginTop:6}}>
          {items.map((it,i)=>(
            <div key={i} style={{display:"flex",gap:6,alignItems:"center"}}>
              <span style={{color:"var(--muted)",fontSize:11,width:18,textAlign:"right",flexShrink:0}}>{i+1}.</span>
              <Inp val={it} onChange={e=>setIt(i,e.target.value)} ph={`Item ${i+1}...`} style={{margin:0,flex:1}}/>
              {items.length>1&&<Btn sz="s" v="g" onClick={()=>remRow(i)}><Icon n="close" s={20}/></Btn>}
            </div>
          ))}
          <button onClick={addRow} style={{alignSelf:"flex-start",background:"none",border:"1px dashed var(--border2)",borderRadius:"var(--rs)",padding:"6px 12px",color:"var(--sub)",fontSize:12,cursor:"pointer",fontWeight:500,marginTop:2,display:"flex",alignItems:"center",gap:4,transition:"all .15s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--accent)";e.currentTarget.style.color="var(--accent)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border2)";e.currentTarget.style.color="var(--sub)";}}>
            <Icon n="add" s={20}/>Adicionar item
          </button>
        </div>
        <Btn onClick={()=>valid&&onCreate({name:name.trim(),icon,cat,items:items.filter(i=>i.trim())})} dis={!valid} style={{width:"100%",justifyContent:"center",marginTop:22,padding:"13px"}}>
          <Icon n="check" s={20}/>Criar Template
        </Btn>
      </Sheet>
    </Ov>
  );
}
