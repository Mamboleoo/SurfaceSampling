var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},t={},o={},i=e.parcelRequire9c5a;null==i&&((i=function(e){if(e in t)return t[e].exports;if(e in o){var i=o[e];delete o[e];var n={id:e,exports:{}};return t[e]=n,i.call(n.exports,n,n.exports),n.exports}var r=new Error("Cannot find module '"+e+"'");throw r.code="MODULE_NOT_FOUND",r}).register=function(e,t){o[e]=t},e.parcelRequire9c5a=i);var n=i("bexK8"),r=i("9ZOeg"),a=i("kXB5i");const s=document.querySelector(".content"),l=new n.Scene,c=new n.PerspectiveCamera(75,s.offsetWidth/s.offsetHeight,.1,1e3);c.position.z=220,c.position.y=100,c.lookAt(0,0,0);const d=new n.WebGLRenderer({antialias:!0,alpha:!0});d.setSize(s.offsetWidth,s.offsetHeight),s.appendChild(d.domElement);const p=new n.Group;l.add(p);let f=null,u=[];(new r.OBJLoader).load("Elephant_Model.obj",(e=>{f=new a.MeshSurfaceSampler(e.children[0]).build();for(let e=0;e<4;e++){const t=new g(e);u.push(t),p.add(t.line)}d.setAnimationLoop(y)}),(e=>console.log(e.loaded/e.total*100+"% loaded")),(e=>{console.log("oops"),console.error(e)}));const h=new n.Vector3,w=[new n.LineBasicMaterial({color:16428416,transparent:!0,opacity:.5}),new n.LineBasicMaterial({color:16738151,transparent:!0,opacity:.5}),new n.LineBasicMaterial({color:16727400,transparent:!0,opacity:.5}),new n.LineBasicMaterial({color:10957961,transparent:!0,opacity:.5})];class g{constructor(e){this.geometry=new n.BufferGeometry,this.material=w[e%4],this.line=new n.Line(this.geometry,this.material),this.vertices=[],f.sample(h),this.previousPoint=h.clone()}update(){let e=!1;for(;!e;)f.sample(h),h.distanceTo(this.previousPoint)<30&&(this.vertices.push(h.x,h.y,h.z),this.previousPoint=h.clone(),e=!0);this.geometry.setAttribute("position",new n.Float32BufferAttribute(this.vertices,3))}}function y(e){p.rotation.y+=.002,u.forEach((e=>{e.vertices.length<1e4&&e.update()})),d.render(l,c)}window.addEventListener("resize",(function(){c.aspect=s.offsetWidth/s.offsetHeight,c.updateProjectionMatrix(),d.setSize(s.offsetWidth,s.offsetHeight)}),!1);