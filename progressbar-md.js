const util = require('util');
const EventEmitter = require('events');
const pad = require('pad-md');

ProgressBar = function(options){
  options = options || {};
  this.w = options.width || 20;
  this.mw = options.min_width || 4;
  this.f = options.filled || Number();
  this.e = this.w - this.f;
  this.c = options.complete || '#';
  this.i = options.incomplete || ' ';
  this.p = options.position || 'left';
  this.bl = options.bl || '[';
  this.br = options.br || ']';
  this.str = options.str || String();
  this.pr = this.f.toString() || '0';
  this.cursor.hide();
  this.fmt = options.format || ':str :spc:bar :pct';
  this.tick = options.tick || 10;
  this.interpolate_t = undefined;
  this.target = Number();
  process.on('exit', () => {
    this.close();
  });
};

util.inherits(ProgressBar, EventEmitter);

ProgressBar.prototype.open = function() {
  this.progress('0');
  this.cursor.hide();
}
ProgressBar.prototype.new = function() {
  this.progress('0');
  this.cursor.hide();
  console.log();
};
ProgressBar.prototype.close = function() {
  this.progress('0');
  console.log();
  this.cursor.show();
};
ProgressBar.prototype.progress = function(progress) {
  this.pr = progress;
  this.f = Math.floor((parseInt(this.pr)/100)*this.w);
};
ProgressBar.prototype.format = function(self,format) {
  self.fmt = format;
};
ProgressBar.prototype.message = function(self,text) {
  self.str = text;
};
ProgressBar.prototype.cursor = {};
ProgressBar.prototype.cursor.hide = function() {
  process.stdout.write(`\x1B[?25l`);
};
ProgressBar.prototype.cursor.show = function() {
  process.stdout.write(`\x1B[?25h`);
};
ProgressBar.prototype.width = function(width) {
  this.w = width;
};
ProgressBar.prototype.min_width = function(width) {
  this.mw = width;
};
ProgressBar.prototype.filled = function(fill) {
  this.c = fill;
};
ProgressBar.prototype.empty = function(fill) {
  this.i = fill;
};
ProgressBar.prototype.boundary = function(left, right) {
  this.bl = left;
  this.br = right;
};
ProgressBar.prototype.render = function(fn = null, fmsg = null, ffn = null) {
  fmsg?this.str=fmsg:null;
  ffn?fn=ffn:null;
  let txt = '\r';
      txt += this.fmt;
  let bar = `${this.bl}`;
      bar += `${this.c.repeat(this.f)}`;
      bar += `${this.i.repeat(this.e)}`;
      bar += `${this.br}`;
  txt = txt.replace(':bar', bar);
  txt = txt.replace(':pct', `${pad.left(`${this.pr}%`,4)}`);
  if(fn&&this.str) var col=process.stdout.columns-txt.length-fn(`${this.str}`).length+':str'.length+':spc'.length;
  txt = txt.replace(':str', fn&&this.str?`${fn(this.str).message}`:`${this.str}`);
  if(!fn) var col=process.stdout.columns - txt.length + ':spc'.length;
  if(col<0){ var nb=this.newBar(col); txt = txt.replace(`${bar}`, nb); }
  else if(this.w !== 20 && this.pr === '100'){ this.width(20)}
  txt = txt.replace(':spc', ' '.repeat(col<0?0:col))
  process.stdout.write(txt);
};

ProgressBar.prototype.newBar = function(col) {
  if(this.w + col > this.mw -1) this.calcBar(this.pr,this.w+col);
  let new_bar = `${this.bl}`;
      new_bar += `${this.c.repeat(this.f)}`;
      new_bar += `${this.i.repeat(this.e)}`;
      new_bar += `${this.br}`;
  return new_bar;
}

ProgressBar.prototype.calcBar = function(progress, width) {
  this.w = width;
  this.pr = progress.toString();
  this.f = Math.floor(this.w * (this.limit(parseInt(this.pr)) / 100));
  this.e = this.w - this.f;
}

ProgressBar.prototype.update = function(percentage, options) {
  var self = this;
  options = options || {};
  fn = options.function || null;
  fmsg = options.fmessage || null;
  ffn = options.ffunction || null;
  if(options.message) this.message(self,options.message);
  this.target = Math.round(this.limit(percentage)).toString();
  if(this.pr !== this.target) {
    this.interpolate_t = setInterval(function() {
      if(self.pr === self.target) clearInterval(self.interpolate_t);
      if(self.pr === '100') { 
        self.render(fn,fmsg,ffn);
        self.emit('complete');
      }
      if(parseInt(self.pr)<parseInt(self.target)) {
        let temp = self.limit(parseInt(self.pr)+1);
        self.calcBar(temp,self.w);
        self.render(fn);
      }
    }, self.tick);
  } else {
    clearInterval(this.interpolate_t);
    this.calcBar(percentage,this.w);
    if(this.pr === '100') {
      this.render(fn,fmsg,ffn);
      this.emit('complete');
    } else this.render(fn);
  }
};
ProgressBar.prototype.limit = function(unbound) {
  return Math.min(Math.max(0, unbound), 100);
};

const progressbar = new ProgressBar();

module.exports = progressbar;