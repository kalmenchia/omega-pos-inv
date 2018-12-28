// Dom7
var $$ = Dom7;


var store = localStorage;
var debugMode = true;
var statusQR;
// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'com.mbutgae.omega.inv', // App bundle ID
  version: '1.0.21',
  name: 'Omega POS Inventory', // App name
  theme: 'auto', // Automatic theme detection
  pushState: true, //backButton
 //  view: {
 //pushStateRoot: ‘/example/’, // if the address like this https://www.example.com/example/ 5
 //  },
  // Enable swipe panel
  panel: {
    // swipe: 'both',
    // swipeCloseOpposite: true,
  },
  // App root data
  data: dataRoot,
  methods: methods,
  routes: routes,
  on: events,
});


//preAuth
function isLoggedIn() {
  if(store.uid != undefined && store.key != undefined) {
    return true;
  }else{
    return false;
  }
};

var homeView = app.views.create('#view-home', {
  url: '/'
});
$$('#view-home').on('tab:show', function () {
  homeView.router.refreshPage();
  homeView.router.back({
    url: '/', // - in case you use Ajax pages
    // pageName: 'homepage_name', // - in case you use Inline Pages or domCache
    force: true
  });
});



// Login Screen Demo
$$('#my-login-screen .login-button').on('click', function () {
  var networkState = navigator.connection.type;
  if (networkState === Connection.NONE) {
    app.dialog.alert('Tidak ada koneksi', 'OFFLINE');
  }
  $$('.progressbar-infinite').show();
  var username = $$('#my-login-screen [name="username"]').val();
  var password = $$('#my-login-screen [name="password"]').val();
  var formData = app.form.convertToData('#login-form');
  setTimeout(function () {
    app.request.post('http://khojati.id/titip/api/auth.php', formData, 
      function(response){
        $$('.progressbar-infinite').hide();

        output = JSON.parse(response);

        if(output.status=='success'){

          localStorage.uid = output.data.uid;
          localStorage.key = output.data.key;
          localStorage.user = JSON.stringify(output.user);
          app.loginScreen.close('#my-login-screen');
          app.dialog.alert('Selamat Datang '+output.user.firstname, 'Welcome');
          homeView.router.back({ url: '/',force: true	});

        }else{
          app.dialog.alert('username atau password salah', 'Error Input');
        }
      },
      function(xhr, status){
        $$('.progressbar-infinite').hide();
        app.dialog.alert('Error XHR', 'Error');
        console.error('Error: '+JSON.stringify(xhr));
        console.error('ErrorStatus: '+JSON.stringify(status));
      }
      );
  },      1000);
});

// Login Screen Demo
$$('.logout-button').on('click', function () {
  setTimeout(function () {
    homeView.router.refreshPage();
    homeView.router.back({
      url: '/', // - in case you use Ajax pages
      // pageName: 'homepage_name', // - in case you use Inline Pages or domCache
      force: true
    });
    console.log('logout');
    localStorage.clear();
    app.loginScreen.open('#my-login-screen');
  }, 1000);
});

$$('.convert-form-to-data').on('click', function(){
  var formData = app.form.convertToData('#setting-form');
  app.dialog.alert(JSON.stringify(formData));
  console.log('xxxxxxx');
});

$$('.status-qr').on('click', function(){
  var done = function(err){
    if(err){
      app.dialog.alert(JSON.stringify(err,null,2), 'Error QR');
      console.error('ERROR on STATUS QR on CLICK',err._message);
      var errQR = app.toast.create({text: 'QRScanner is Error. Status: \n'+JSON.stringify(err,null,2)+'.', position: 'bottom', closeTimeout: 5000,});
      errQR.open();
      QRScanner.destroy();

    } 
    QRScanner.getStatus(function(status){
      statusQR = status;
      app.dialog.alert(JSON.stringify(status,null,2), 'Status QR');

      var statQR = app.toast.create({text: 'NO Error. \n'+JSON.stringify(status,null,2)+'.', position: 'bottom', closeButton: true});
      statQR.open();
      QRScanner.destroy();

    });
  };
  QRScanner.prepare(done);
});

$$('.scan-qr').on('click', function(){

  // QRScanner.prepare(onDone); // show the toast
  // function onDone(err){
  //   // console.error(err);
  //   if (err) {
  //   // here we can handle errors and clean up any loose ends.
  //   // console.error(err._message);
  //   errTEXT = err.code+' => '+err.name+' => '+err._message;
  //   // console.error(errTEXT);
  //   prepQRErr = app.toast.create({text: errTEXT, position: 'bottom', closeButton: true, closeButtonText: 'Tutup', closeButtonColor: 'red', });
  //   prepQRErr.open();
  //   QRScanner.cancelScan();

  //   }
  //   else{
  //     QRScanner.getStatus(function(status){
  //       // console.log(status);
  //       var prepQRStat = app.toast.create({text: 'QRSCANNER.GETSTATUS. \n'+JSON.stringify(status,null,2)+'.',position: 'bottom', closeButton: true});
  //       prepQRStat.open();

  //     });
  //   }
  //     // console.error('NO ERROR');
  // }

   
  // Make the webview transparent so the video preview is visible behind it. Be sure to make any opaque HTML elements transparent here to avoid covering the video.
  
  var callback = function(err, contents){
    console.log('QRSCANNER SCANNING... on callback');
    if(err){console.error(err._message);}
    $$('#app').addClass('ketok');
    $$('#my-popup').addClass('ketok');
    $$('#my-login-screen').addClass('ketok');
    app.dialog.alert('The QR Code contains: ' + contents);

    QRScanner.hide(function(status){
      console.log('QRSCANNER HIDING...');
      $$('#app').removeClass('ra-ketok');
      $$('#my-popup').removeClass('ra-ketok');
      $$('#my-login-screen').removeClass('ra-ketok');
      QRScanner.cancelScan();
    });

  };
   
  QRScanner.scan(callback);

  
  QRScanner.show(function(status){
    console.log('QRSCANNER SHOWING...');
    $$('#app').removeClass('ketok');
    $$('#my-popup').removeClass('ketok');
    $$('#my-login-screen').removeClass('ketok');

    $$('#app').addClass('ra-ketok');
    $$('#my-popup').addClass('ra-ketok');
    $$('#my-login-screen').addClass('ra-ketok');
    console.log('QRSCANNER SCANNING...on SHOW METHOD');
    QRScanner.scan(callback);


    console.log(status);
  });

});


$$('.show-qr').on('click', function(){
  $$('#app').addClass('ra-ketok');
  QRScanner.show(function(status){
    console.log(status);
    app.dialog.alert('SHOW QR: ' + status);
    $$('#app').addClass('ketok');
  });
});

$$('.cordova-file').on('click', function(){
	// console.log(JSON.stringify(cordova.file,null,2));
	// filecdv = JSON.stringify(cordova.file,null,2);
	// app.dialog.alert(filecdv);
	// var cdvFileToast = app.toast.create({text: 'CORDOVA.FILE.GETSTATUS. \n'+JSON.stringify(cordova.file,null,2)+'.',position: 'bottom', closeButton: true});
 //  cdvFileToast.open();
});
$$('a.smart-select').on('click', function(){
  app.dialog.alert('SMART SELECT CLICKED!');
});


document.addEventListener('deviceready', () => {
  console.log('on document addEventListener(deviceready) =>Device ready event fired!',' LINE:385');
  document.addEventListener('backbutton', onBackKeyDown, false);
  document.addEventListener("offline", onOffline, false);
  document.addEventListener("online", onOnline, false);
  document.addEventListener("pause", onPause, false);
  document.addEventListener("resume", onResume, false);
  
});





function onBackKeyDown() {
  var cpage = app.views.main.router.url;
  var cpagename = cpage.name;
  var leftp = app.panel.left && app.panel.left.opened;
  var rightp = app.panel.right && app.panel.right.opened;
  openedDialog = $$('.dialog.modal-in').length;

    if (leftp || rightp) { // #leftpanel and #rightpanel are id of both panels.
      app.panel.right.close(true);
      app.panel.left.close(true);

      return false;
    } else if (cpage == '/' && openedDialog < 1) {
      app.dialog.confirm('Are you sure you want to exit?', function() {
            // var deviceType = device.platform;
            // if(deviceType == 'Android' || deviceType == 'android'){
              navigator.app.exitApp();
            // }
          },
          function() {
          });
    } else {
      homeView.router.back();
      homeView.router.refreshPage();
      homeView.router.back({
      url: '/', // - in case you use Ajax pages
      // pageName: 'homepage_name', // - in case you use Inline Pages or domCache
      force: true
    });
    }

  }



  function onOnline() {
    toastOnline = app.toast.create({text: 'ONLINE: Koneksi Internet Kembali Aktif', position: 'bottom', closeTimeout: 1000,});
    toastOnline.open();
  }

  function onOffline() {
    toastOffline = app.toast.create({text: 'OFFLINE: Tidak Ada Koneksi Internet',position: 'bottom', closeTimeout: 1000, });
    toastOffline.open();
  }


  function onPause() {
    toastP = app.toast.create({text: 'PAUSE: Aplikasi di Minimize',position: 'bottom', closeTimeout: 1000, });
    toastP.open();
  }

  function onResume() {
    setTimeout(function() {
      toastR = app.toast.create({text: 'RESUME: Kembali ke Aplikasi',position: 'bottom', closeTimeout: 1000, });
      toastR.open();
    }, 0);
  }

  Template7.registerHelper('formatDate', function(date){
    var newDate = date.substr(0,10);
    return newDate;
  });

  Template7.registerHelper('formatRupiah', function(number){
    var newNum = 'Rp. '+number;
    return newNum;
  });