import{c as f,b as v,u as y,r as o,j as e,S as j,m as w,B as N,A as $}from"./index-Ln9xdZkh.js";import{P as k}from"./PageWrapper-DQst0oAW.js";const I=f("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);function E(i){return{title:(i==null?void 0:i.split("-").map(c=>c.charAt(0).toUpperCase()+c.slice(1)).join(" "))||"Blog Post",excerpt:"A deep dive into modern web development patterns and practices.",content:`
## Introduction

This article explores advanced techniques in modern web development. We'll cover key patterns that help build performant, maintainable applications.

## Core Concepts

Understanding the fundamentals is crucial before diving into advanced patterns. Here we break down the building blocks that power modern web experiences.

### Component Architecture

Well-structured components form the backbone of any scalable application. We look at composition patterns, prop drilling solutions, and state boundaries.

### Performance Patterns

From code splitting to memoization, these patterns ensure your application remains fast as it scales.

## Implementation

Let's walk through a practical example that demonstrates these concepts in action. Each step builds on the previous one.

### Setting Up

First, we establish our project structure and tooling. A solid foundation prevents issues down the road.

### Building the Core

With the foundation in place, we implement the core functionality step by step.

## Advanced Techniques

Once comfortable with the basics, these advanced techniques unlock new possibilities for your applications.

## Conclusion

Modern web development rewards those who invest in solid patterns and architecture. The techniques covered here provide a strong foundation for building scalable applications.
    `.trim(),date:new Date().toISOString(),readTime:"8 min read",category:"React",author:"Edeh Chinedu Daniel"}}const A=[{slug:"post-2",title:"Building 3D Web Experiences with React Three Fiber"},{slug:"post-3",title:"TypeScript Best Practices in Modern React"},{slug:"post-4",title:"Performance Optimization Techniques"}],P=()=>{const{slug:i}=v(),c=y(),s=o.useMemo(()=>E(i||""),[i]),m=o.useRef(null),[u,g]=o.useState(""),d=o.useMemo(()=>{const t=s.content.split(`
`),r=[];return t.forEach(n=>{const a=n.match(/^(#{2,3})\s+(.+)/);if(a){const l=a[1].length,h=a[2],b=h.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");r.push({id:b,text:h,level:l})}}),r},[s.content]),p=o.useMemo(()=>s.content.replace(/^### (.+)$/gm,'<h3 id="$ID" class="text-xl font-semibold text-text-primary mt-10 mb-4">$1</h3>').replace(/^## (.+)$/gm,'<h2 id="$ID" class="text-display-md font-serif text-text-primary mt-12 mb-6">$1</h2>').replace(/^(?!<h[23])((?!\s*$).+)$/gm,'<p class="text-body-md text-text-muted mb-4 leading-relaxed">$1</p>').replace(/<h([23]) id="\$ID"/g,(t,r)=>`<h${r} id="PLACEHOLDER_ID"`),[s.content]),x=o.useMemo(()=>{let t=0;return p.replace(/id="PLACEHOLDER_ID"/g,()=>{const r=d[t];return t++,r?`id="${r.id}"`:'id=""'})},[p,d]);return o.useEffect(()=>{const t=m.current;if(!t)return;const r=t.querySelectorAll("h2, h3"),n=new IntersectionObserver(a=>{for(const l of a)l.isIntersecting&&g(l.target.id)},{rootMargin:"-80px 0px -60% 0px"});return r.forEach(a=>n.observe(a)),()=>n.disconnect()},[x]),e.jsx(k,{title:`${s.title} | Blog`,description:s.excerpt,children:e.jsx(j,{id:"blog-detail",children:e.jsxs("div",{className:"max-w-6xl mx-auto",children:[e.jsxs("button",{onClick:()=>c("/blog"),className:"flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-8",children:[e.jsx(I,{className:"w-4 h-4"}),"Back to Blog"]}),e.jsxs(w.div,{initial:{opacity:0,y:30},animate:{opacity:1,y:0},className:"w-full h-64 md:h-80 bg-surface rounded-md border border-border flex items-center justify-center mb-12 overflow-hidden relative",children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent"}),e.jsx("span",{className:"text-display-lg font-serif text-text-muted/20 select-none",children:s.category})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-12",children:[e.jsxs("article",{className:"min-w-0",children:[e.jsxs("header",{className:"space-y-4 mb-12",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(N,{variant:"muted",children:s.category}),e.jsx("span",{className:"text-xs text-text-muted font-mono",children:s.readTime})]}),e.jsx("h1",{className:"text-display-lg font-serif text-text-primary",children:s.title}),e.jsx("div",{className:"flex items-center justify-between pt-4 border-t border-border",children:e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-semibold text-text-primary",children:s.author}),e.jsx("p",{className:"text-xs text-text-muted",children:new Date(s.date).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})})]})})]}),e.jsx("div",{ref:m,className:"prose-custom",dangerouslySetInnerHTML:{__html:x}}),e.jsxs("div",{className:"mt-16 pt-8 border-t border-border space-y-6",children:[e.jsx("h3",{className:"text-lg font-semibold text-text-primary",children:"Related Articles"}),e.jsx("div",{className:"space-y-3",children:A.map(t=>e.jsxs("button",{onClick:()=>c(`/blog/${t.slug}`),className:"flex items-center justify-between w-full p-4 border border-border rounded-md hover:border-text-muted/40 transition-colors text-left group",children:[e.jsx("span",{className:"text-sm text-text-muted group-hover:text-text-primary transition-colors",children:t.title}),e.jsx($,{className:"w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform"})]},t.slug))})]})]}),e.jsx("aside",{className:"hidden lg:block",children:e.jsxs("nav",{className:"sticky top-24 space-y-1",children:[e.jsx("p",{className:"text-xs text-text-muted uppercase tracking-wider mb-3 font-mono",children:"On this page"}),d.map(t=>e.jsx("a",{href:`#${t.id}`,onClick:r=>{var n;r.preventDefault(),(n=document.getElementById(t.id))==null||n.scrollIntoView({behavior:"smooth"})},className:`block text-sm transition-colors ${t.level===3?"pl-4":""} ${u===t.id?"text-text-primary font-medium":"text-text-muted hover:text-text-primary"}`,children:t.text},t.id))]})})]})]})})})};export{P as BlogDetailPage};
//# sourceMappingURL=BlogDetail-CFb5v0FY.js.map
