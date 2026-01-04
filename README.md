# dw-quote-speckit

This project uses opensource Github speckit with VS code & Github copilot to create a response dwelling quote management website.

## speckit prompts
1.Give guiding principles for your project (**/speckit.constitution**)

/speckit.constitution Create principles focused on a dynamic, fast-loading dwelling quote web site. Ensure the design is mobile-first, and data will be stored in a simple JSON file initially.The website takes input from the user in the form of a workflow, suggests appropriate house insurance plan & finally creates a quote.

2.Use the **/speckit.specify** command to outline the what and why of the dwelling quote site, focusing on user stories and functional requirements

/speckit.specify Build an online dwelling quote site where users can input details like property size, location, and desired coverage to receive an estimated quote instantly. The site should have a single-page interface, clear form validation, and display a "Contact Us" message for quotes over a certain value.

3.Use the **/speckit.plan** command to define the how, specifying the tech stack and architecture based on your constitution and spec.

/speckit.plan The application will use react.js for the frontend, bootstrap for CSS, a simple Node.js/Express backend to serve the application, and use a local file for mock quote data. The quote calculation logic should be implemented in a single, well-tested JavaScript module. Cypress test cases needs to be written.The Cypress testcases created should strictly follow code coverage of 100%.

4.**/speckit.tasks**

5.**/speckit.implement**

## front end working screen shot

![Frontend Screenshot](./images/InstantDwellingQuoteFE.png)

## End end working screen shot

![Backend Screenshot](./images/InstantDwellingQuoteBE.png)
