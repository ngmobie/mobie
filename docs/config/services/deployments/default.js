module.exports = function defaultDeployment () {
	return {
		name: 'default',
		examples: {
      commonFiles: {
        scripts: [
          '../../lib/Faker/build/build/faker.min.js',
        	'../../lib/angular/angular.min.js',
        	'../../lib/angular-animate/angular-animate.min.js',
        	'../../lib/mobie.js'
        ]
      },
      dependencyPath: '../../../'
    },
		stylesheets: [
			'css/app.css'
		]
	};
};