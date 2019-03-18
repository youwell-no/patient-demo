# Youwell.Platform.Patient-Demo

This application is a basic demonstation of the patient side of the Youwell Platform. 

It has the following features:
- Login with Youwell.Platform authorization
- Go through you assigned program (read/watch/listen/answer)
- Respond to questionnaires and screening-tasks
- Edit you profile-information
- Communicate with your therapist


## Development
### Prerequisites
- Node/npm
- .Net Core 2.2

### Structure
The application is build as a Single Page Application (SPA) in javascript (using React/Redux). .Net Core is only used to host the application. It could be hostet by any web application framework. All the relevant client-side code resides in the ./ClientApp folder.

Some configuration for the application is found in ./appsettings.json, but the only neccessary configuration is the url to the Youwell.Platform API:

Production: https://portal.youwell.no/api
 - Allows incoming requests only from whitelisted domains

Test: https://portal-customer-test.youwell.no/api
 - Allows incoming requests from https://localhost (ports 5000-5010) + whitelisted test-domains


### Build and run

  - Run `npm install` - This installs all required npm packages
  - Run `npm run build` - This checks and builds all the needed assets for this solution (as configured in webpack.config.js)
  - Run `dotnet run` - Builds and starts the web application in a .net core hosting
  
  Dotnet core starts the application on both http://localhost:500 and  https://localhost:5001), but you need to use the HTTPS url to communicate with the server. If you need to install a certificate for localhost you can use the dotnet command `dotnet dev-certs https --trust`.
  
You also need an account in the Customer-Test version of our platform (log in at https://portal-customer-test.youwell.no) in order to test your application during development. If you dont have this please contact us at contact@youwell.no.


## Tools and Frameworks
This application is build by React and Redux. Other tools used are:
- Material UI - React components that implement Google's Material Design (https://material-ui.com/)
- Babel - For transpiling JSX and ES6 into javascript supported by all targeted browsers 
- ESLint - For checking and correcting syntax and common javascript-pitfalls
- Webpack - For orchestrating all the tools and packaging assets

Take a look at `packages.json` to get an overview of all packages in use


## Contact
If you have questions about the Youwell Platform please feel free to contact us at contact@youwell.no
