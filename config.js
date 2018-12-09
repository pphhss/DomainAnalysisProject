
config = {

  db : {
     connectionLimit : 50,
     host : "localhost",  // Please input MySQL server IP
     user : "root",       // Please input MYSQL ID
     password : "root",   // Please input MySQl password
     database : 'domain'
  },

  server : {
    port : 4000 // Please input port number you want
  }

}

module.exports = config;