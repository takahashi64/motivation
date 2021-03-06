(function(){

var $  = document.getElementById.bind(document);
var $$ = document.querySelectorAll.bind(document);

var App = function($el){
  this.$el = $el;
  this.load();

  this.$el.addEventListener(
    'submit', this.submit.bind(this)
  );

  if (this.dob) {
    this.renderAgeLoop();
  } else {
    this.renderChoose();
  }
};

App.fn = App.prototype;

App.fn.load = function(){
  var value;

  if (value = localStorage.dob) {
      this.dob = new Date(parseInt(value));
      this.dob.setTime(this.dob.getTime() + 1000 * 60 * this.dob.getTimezoneOffset());
  }
};

App.fn.save = function(){
  if (this.dob)
    localStorage.dob = this.dob.getTime();
};

App.fn.submit = function(e){
  e.preventDefault();

  var input = this.$$('input')[0];
  if ( !input.valueAsDate ) return;

  this.dob = input.valueAsDate;
  this.save();
  this.dob.setTime(this.dob.getTime() + 1000 * 60 * this.dob.getTimezoneOffset());
  this.renderAgeLoop();
};

App.fn.renderChoose = function(){
  this.html(this.view('dob')());
};

App.fn.renderAgeLoop = function(){
  this.interval = setInterval(this.renderAge.bind(this), 100);
};

App.fn.calculateAge = function(){
    var now   = new Date;
    var age   = now.getFullYear() - this.dob.getFullYear();
    var mDiff = now.getMonth() - this.dob.getMonth();

    if (mDiff < 0 || (mDiff === 0 && now.getDate() < this.dob.getDate())) {
        age--;
    }

    return age;
};

App.fn.calculateMS = function(){
    var now            = new Date;
    var lastBirthday = new Date(this.dob.getTime());
    var ms;

    lastBirthday.setYear(now.getFullYear()-1);
    ms = (now.getTime() - lastBirthday.getTime()) / 31556952000;

    return ms.toFixed(9).toString().split('.')[1];
};

App.fn.calculateMilestone = function(){
    var now            = new Date;
    var lastBirthday = new Date(this.dob.getTime());
    var nextBirthday = new Date(this.dob.getTime());
    var ms;

    lastBirthday.setYear(now.getFullYear()-1);
    nextBirthday.setYear(now.getFullYear());
    var totalTimeThisYear = (nextBirthday.getTime() - lastBirthday.getTime());

    ms = (now.getTime() - lastBirthday.getTime()) / 31556952000;

    var msRoundedUpQuarter = Math.ceil(ms*4)/4;

    return (new Date(lastBirthday.getTime() + (totalTimeThisYear*msRoundedUpQuarter))).toDateString();
};



App.fn.renderAge = function(){
    requestAnimationFrame(function(){
        this.html(this.view('age')({
            year:         this.calculateAge(),
            milliseconds: this.calculateMS(),
            milestone: this.calculateMilestone()
        }));
    }.bind(this));
};

App.fn.$$ = function(sel){
  return this.$el.querySelectorAll(sel);
};

App.fn.html = function(html){
  this.$el.innerHTML = html;
};

App.fn.view = function(name){
  var $el = $(name + '-template');
  return Handlebars.compile($el.innerHTML);
};

window.app = new App($('app'))

})();
