document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("form");

    if (!form) return;

    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        const fullName = form.querySelector('[name="fullname"]');
        const company = form.querySelector('[name="company"]');
        const email = form.querySelector('[name="email"]');
        const phone = form.querySelector('[name="phone"]');
        const country = form.querySelector('[name="country"]');
        const industry = form.querySelector('[name="industry"]');

        const leadSource = form.querySelector('[name="leadSource"]');
        const eventName = form.querySelector('[name="eventName"]');

        const comments = form.querySelector('[name="comments"]');

        const catalogues = Array.from(
            form.querySelectorAll('input[name="catalogues[]"]:checked')
        ).map(c => c.value);

        if (
            fullName.value.trim() === "" ||
            company.value.trim() === "" ||
            email.value.trim() === "" ||
            leadSource.value.trim() === ""
        ) {
            alert("Please complete all required fields.");
            return;
        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email.value.trim())) {
            alert("Please enter a valid email address.");
            email.focus();
            return;
        }

        if (catalogues.length === 0) {
            alert("Please select at least one product catalogue.");
            return;
        }

        const submitButton = form.querySelector("button");

        submitButton.disabled = true;
        submitButton.innerText = "Sending...";

        try {

            alert(
  JSON.stringify({
    leadSource: leadSource.value,
    eventName: eventName.value
  }, null, 2)
);
            const response = await fetch(
                "/.netlify/functions/send-email",
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        fullname: fullName.value,
                        company: company.value,
                        email: email.value,
                        phone: phone.value,
                        country: country.value,
                        industry: industry.value,
                        leadSource: leadSource.value,
                        eventName: eventName.value,
                        comments: comments.value,
                        catalogues: catalogues

                    })

                }
            );

            const result = await response.json();

            if (result.success) {

                window.location.href = "/thank-you.html";

            } else {

                alert("Unable to send request.");

                console.error(result);

            }

        } catch (err) {

            console.error(err);

            alert("Something went wrong.");

        }

        submitButton.disabled = false;
        submitButton.innerText = "REQUEST CATALOGUES";

    });

});