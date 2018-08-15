node {
	
        echo "Running ${env.BUILD_ID} on ${env.JENKINS_URL}"
	
	stage('build') {
	    echo 'building...'
	    sh 'ls -al'
	}
	stage('unit test') {
	    echo '...'
	}
	stage('package') {
	    echo '...'
	}
	stage('create VM') {
	    echo '...'
	}
	stage('deploy to test') {
	    echo '...'
	}
	stage('smoke test') {
	    echo '...'
	}
	stage('acceptance test') {
	    echo '...'
	}
	
	if (env.BRANCH_NAME == 'master') {
	stage('release!') {
    	    echo "We are currently working on branch: ${env.BRANCH_NAME}"
		
	    switch (env.BRANCH_NAME) {
                case 'master': 
                  env.DEPLOYMENT_ENVIRONMENT = 'prod';
                  env.PROPERTY_FILE = 'env.prod.properties';
		  echo 'Releasing!'
                break;
                default:
		  env.DEPLOYMENT_ENVIRONMENT = 'no_deploy';
		  echo 'Feature branch build no release'
            }
	}
	}
}
