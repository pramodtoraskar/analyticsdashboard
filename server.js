#!/bin/env node
//  OpenShift sample Node application

var application_root 	= __dirname;
var express 			= require('express');
var fs      			= require('fs');
var path    			= require('path');
var cons    			= require('consolidate');

/**
 *  Define the sample application.
 */
var SampleApp = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' };
        }

        //  Local cache for static content.
        self.zcache['index.html'] = fs.readFileSync('./index.html');
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) { return self.zcache[key]; };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
    	
        self.routes = { };
        
        var site_list = {
        		'All Participating Websites':'/',
        		'redhat.com':'/redhat',
        		'access.redhat.com':'/customerportal',
        		'opensource.com':'/opensource',
        		'enterprisersproject.com':'/enterprisersproject',
        		'developers.redhat.com': '/developersredhat',
        		'partner.redhat.com': '/partnerredhat',
        		'jboss.org': '/jboss',
        		'openshift.com': '/openshift',
        		'connect.redhat.com':'/connectredhat',
        		'training.redhat.com':'/trainingredhat' 
        			
        }
        /* prod settings  
        var app_baseurl = 'http://analyticsdashboard-ptoraska.itos.redhat.com';
        var api_baseurl = 'http://analyticsapireporter-ptoraska.itos.redhat.com';*/
        
        /*ToDo CleanUp*/
        var app_baseurl = 'http://127.0.0.1:8080';
        var api_baseurl = 'http://127.0.0.1:8081';/*
        var api_baseurl = 'http://analyticsapireporter-ptoraska.itos.redhat.com';*/
        
        	
        var modelDataMapping = {
        		'default': {
                    title: 'analytics dashboard | All Participating Websites traffic.',
                    data_url: api_baseurl +'/all/data/live',
                    download_api_url: api_baseurl+'/data/download/glob',
                    nav_url: {
                        yesterday : app_baseurl +'/',
                        days_7 : app_baseurl +'/all/7',
                        days_30 : app_baseurl +'/all/30',
                    },
                    site: {
                    	baseurl : app_baseurl,
                    	site_list_obj : site_list,
                    	site_name : 'All Participating Websites'
                    }
                },
                'redhat': {
                    title: 'analytics dashboard | The redhat.com web traffic.',
                    data_url: api_baseurl +'/rd/data/live',
                    download_api_url: api_baseurl+'/data/download/rd',
                    nav_url: {
                        yesterday : app_baseurl +'/',
                        days_7 : app_baseurl +'/redhat/7',
                        days_30 : app_baseurl +'/redhat/30',
                    },
                    site: {
                    	baseurl : app_baseurl,
                    	site_list_obj : site_list,
                    	site_name : 'redhat.com'
                    	
                    }
                },
                'customerportal': {
                    title: 'analytics dashboard | The access.redhat.com web traffic.',
                    data_url: api_baseurl +'/cp/data/live',
                    download_api_url: api_baseurl+'/data/download/cp',
                    nav_url: {
                        yesterday : app_baseurl +'/',
                        days_7 : app_baseurl +'/customerportal/7',
                        days_30 : app_baseurl +'/customerportal/30',
                    },
                    site: {
                    	baseurl : app_baseurl,
                    	site_list_obj : site_list,
                    	site_name : 'access.redhat.com'
                    }
                },
                'opensource': {
                    title: 'analytics dashboard | The opensource.com web traffic.',
                    data_url: api_baseurl +'/os/data/live',
                    download_api_url: api_baseurl+'/data/download/os',
                    nav_url: {
                        yesterday : app_baseurl +'/',
                        days_7 : app_baseurl +'/opensource/7',
                        days_30 : app_baseurl +'/opensource/30',
                    },
                    site: {
                    	baseurl : app_baseurl,
                    	site_list_obj : site_list,
                    	site_name : 'opensource.com'
                    }
                },
                'enterprisersproject': {
                    title: 'analytics dashboard | The enterprisersproject.com web traffic.',
                    data_url: api_baseurl +'/ep/data/live',
                    download_api_url: api_baseurl+'/data/download/ep',
                    nav_url: {
                        yesterday : app_baseurl +'/',
                        days_7 : app_baseurl +'/enterprisersproject/7',
                        days_30 : app_baseurl +'/enterprisersproject/30',
                    },
                    site: {
                    	baseurl : app_baseurl,
                    	site_list_obj : site_list,
                    	site_name : 'enterprisersproject.com'
                    }
                },
                'developersredhat': {
                    title: 'analytics dashboard | The developers.redhat.com web traffic.',
                    data_url: api_baseurl +'/de/data/live',
                    download_api_url: api_baseurl+'/data/download/de',
                    nav_url: {
                        yesterday : app_baseurl +'/',
                        days_7 : app_baseurl +'/developersredhat/7',
                        days_30 : app_baseurl +'/developersredhat/30',
                    },
                    site: {
                    	baseurl : app_baseurl,
                    	site_list_obj : site_list,
                    	site_name : 'developers.redhat.com'
                    }
                },
                'partnerredhat': {
                    title: 'analytics dashboard | The partner.redhat.com web traffic.',
                    data_url: api_baseurl +'/pr/data/live',
                    download_api_url: api_baseurl+'/data/download/pr',
                    nav_url: {
                        yesterday : app_baseurl +'/',
                        days_7 : app_baseurl +'/partnerredhat/7',
                        days_30 : app_baseurl +'/partnerredhat/30',
                    },
                    site: {
                    	baseurl : app_baseurl,
                    	site_list_obj : site_list,
                    	site_name : 'partner.redhat.com'
                    }
                },
                'jboss': {
                    title: 'analytics dashboard | The jboss.org web traffic.',
                    data_url: api_baseurl +'/jb/data/live',
                    download_api_url: api_baseurl+'/data/download/jb',
                    nav_url: {
                        yesterday : app_baseurl +'/',
                        days_7 : app_baseurl +'/jboss/7',
                        days_30 : app_baseurl +'/jboss/30',
                    },
                    site: {
                    	baseurl : app_baseurl,
                    	site_list_obj : site_list,
                    	site_name : 'jboss.org'
                    }
                },
                'openshift': {
                    title: 'analytics dashboard | The openshift.com web traffic.',
                    data_url: api_baseurl +'/oh/data/live',
                    download_api_url: api_baseurl+'/data/download/osh',
                    nav_url: {
                        yesterday : app_baseurl +'/',
                        days_7 : app_baseurl +'/openshift/7',
                        days_30 : app_baseurl +'/openshift/30',
                    },
                    site: {
                    	baseurl : app_baseurl,
                    	site_list_obj : site_list,
                    	site_name : 'openshift.com'
                    }
                },
                'connectredhat': {
                    title: 'analytics dashboard | The connect.redhat.com web traffic.',
                    data_url: api_baseurl +'/cr/data/live',
                    download_api_url: api_baseurl+'/data/download/cr',
                    nav_url: {
                        yesterday : app_baseurl +'/',
                        days_7 : app_baseurl +'/connectredhat/7',
                        days_30 : app_baseurl +'/connectredhat/30',
                    },
                    site: {
                    	baseurl : app_baseurl,
                    	site_list_obj : site_list,
                    	site_name : 'connect.redhat.com'
                    }
                },
                'trainingredhat': {
                    title: 'analytics dashboard | The training.redhat.com web traffic.',
                    data_url: api_baseurl +'/tr/data/live',
                    download_api_url: api_baseurl+'/data/download/tr',
                    nav_url: {
                        yesterday : app_baseurl +'/',
                        days_7 : app_baseurl +'/trainingredhat/7',
                        days_30 : app_baseurl +'/trainingredhat/30',
                    },
                    site: {
                    	baseurl : app_baseurl,
                    	site_list_obj : site_list,
                    	site_name : 'training.redhat.com'
                    }
                }
        	}
        
        self.routes['/asciimo'] = function(req, res) {
            var link = "http://i.imgur.com/kmbjB.png";
            res.send("<html><body><img src='" + link + "'></body></html>");
        };

        self.routes['/'] = function(req, res) {
            res.render('analysis_db_yesterday', modelDataMapping['default'] );
        };
        self.routes['/all/7'] = function(req, res) {
            res.render('analysis_db_7days', modelDataMapping['default'] );
        };
        self.routes['/all/30'] = function(req, res) {
            res.render('analysis_db_30days', modelDataMapping['default'] );
        };
        
        self.routes['/redhat'] = function(req, res) {
        	res.render('analysis_db_yesterday', modelDataMapping['redhat'] );
        };
        self.routes['/redhat/7'] = function(req, res) {
        	res.render('analysis_db_7days', modelDataMapping['redhat'] );
        };
        self.routes['/redhat/30'] = function(req, res) {
        	res.render('analysis_db_30days', modelDataMapping['redhat'] );
        };
        
        self.routes['/customerportal'] = function(req, res) {
        	res.render('analysis_db_yesterday', modelDataMapping['customerportal'] );
        };
        self.routes['/customerportal/7'] = function(req, res) {
        	res.render('analysis_db_7days', modelDataMapping['customerportal'] );
        };
        self.routes['/customerportal/30'] = function(req, res) {
        	res.render('analysis_db_30days', modelDataMapping['customerportal'] );
        };
        
        self.routes['/opensource'] = function(req, res) {
        	res.render('analysis_db_yesterday', modelDataMapping['opensource'] );
        };
        self.routes['/opensource/7'] = function(req, res) {
        	res.render('analysis_db_7days', modelDataMapping['opensource'] );
        };
        self.routes['/opensource/30'] = function(req, res) {
        	res.render('analysis_db_30days', modelDataMapping['opensource'] );
        };
        
        self.routes['/enterprisersproject'] = function(req, res) {
        	res.render('analysis_db_yesterday', modelDataMapping['enterprisersproject'] );
        };
        self.routes['/enterprisersproject/7'] = function(req, res) {
        	res.render('analysis_db_7days', modelDataMapping['enterprisersproject'] );
        };
        self.routes['/enterprisersproject/30'] = function(req, res) {
        	res.render('analysis_db_30days', modelDataMapping['enterprisersproject'] );
        };

        self.routes['/developersredhat'] = function(req, res) {
        	res.render('analysis_db_yesterday', modelDataMapping['developersredhat'] );
        };
        self.routes['/developersredhat/7'] = function(req, res) {
        	res.render('analysis_db_7days', modelDataMapping['developersredhat'] );
        };
        self.routes['/developersredhat/30'] = function(req, res) {
        	res.render('analysis_db_30days', modelDataMapping['developersredhat'] );
        };
        
        self.routes['/partnerredhat'] = function(req, res) {
        	res.render('analysis_db_yesterday', modelDataMapping['partnerredhat'] );
        };
        self.routes['/partnerredhat/7'] = function(req, res) {
        	res.render('analysis_db_7days', modelDataMapping['partnerredhat'] );
        };
        self.routes['/partnerredhat/30'] = function(req, res) {
        	res.render('analysis_db_30days', modelDataMapping['partnerredhat'] );
        };

        self.routes['/jboss'] = function(req, res) {
        	res.render('analysis_db_yesterday', modelDataMapping['jboss'] );
        };
        self.routes['/jboss/7'] = function(req, res) {
        	res.render('analysis_db_7days', modelDataMapping['jboss'] );
        };
        self.routes['/jboss/30'] = function(req, res) {
        	res.render('analysis_db_30days', modelDataMapping['jboss'] );
        };
        
        self.routes['/openshift'] = function(req, res) {
        	res.render('analysis_db_yesterday', modelDataMapping['openshift'] );
        };
        self.routes['/openshift/7'] = function(req, res) {
        	res.render('analysis_db_7days', modelDataMapping['openshift'] );
        };
        self.routes['/openshift/30'] = function(req, res) {
        	res.render('analysis_db_30days', modelDataMapping['openshift'] );
        };
        
        self.routes['/connectredhat/'] = function(req, res) {
        	res.render('analysis_db_yesterday', modelDataMapping['connectredhat'] );
        };
        self.routes['/connectredhat/7'] = function(req, res) {
        	res.render('analysis_db_7days', modelDataMapping['connectredhat'] );
        };
        self.routes['/connectredhat/30'] = function(req, res) {
        	res.render('analysis_db_30days', modelDataMapping['connectredhat'] );
        };
        
        self.routes['/trainingredhat'] = function(req, res) {
        	res.render('analysis_db_yesterday', modelDataMapping['trainingredhat'] );
        };
        self.routes['/trainingredhat/7'] = function(req, res) {
        	res.render('analysis_db_7days', modelDataMapping['trainingredhat'] );
        };
        self.routes['/trainingredhat'] = function(req, res) {
        	res.render('analysis_db_30days', modelDataMapping['trainingredhat'] );
        };


    };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.createRoutes();
        self.app = express();
        
        // assign the swig engine to .html files
        self.app.engine('html', cons.swig);
        
        // set .html as the default extension
        self.app.set('view engine', 'html');
        self.app.set('views', __dirname + '/');
        
        self.app.use(express.static(__dirname + '/public'));
        //self.app.use( express.static( path.join( application_root, 'site') ) );
        //  Add handlers for the app (from the routes).
        for (var r in self.routes) {
            self.app.get(r, self.routes[r]);
        }
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
zapp.start()
