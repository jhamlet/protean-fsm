/*globals describe, it, before, after, beforeEach, afterEach */

var should = require('should'),
    protean = require('../'),
    classify = protean.classify;

describe('Protean', function () {
    var Foo;
    
    before(function () {
        Foo = classify({
                constructor: function (arg) {
                    this.foo = arg;
                }
            });
    });

    describe('.inherit(superclass, [subclass], [props], [properties])', function () {
        it('should correctly inherit from superclass', function () {
            var Bar = protean.inherit(Foo);
            Bar.superproto.should.equal(Foo.prototype);
            (new Bar()).should.be.an.instanceof(Foo);
        });
        
        it('getters/setters should be preserved', function () {
            var Bar = protean.inherit(Foo, {
                    constructor: function (arg) {
                        Bar.superclass.call(this, arg);
                    },
                    get bar () {
                        return this.foo;
                    },
                    set bar (v) {
                        this.foo = v;
                    }
                }),
                obj;
            
            Bar.prototype.__lookupGetter__('bar').should.be.function;
            Bar.prototype.__lookupSetter__('bar').should.be.function;
            
            obj = new Bar('bar');
            obj.bar.should.equal('bar');
            obj.bar = 'buz';
            obj.foo.should.equal('buz');
        });
        
        it('should extend non-protean classes', function () {
            var EM = require('events').EventEmitter,
                Foo, obj;
            
            Foo = protean.inherit(EM, {
                constructor: function Foo () {
                    Foo.superclass.call(this);
                }
            });
            
            obj = new Foo();
            
            obj.should.be.an.instanceof(EM);
            obj.should.have.property('domain', null);
            obj.should.have.property('_events');
            obj.should.have.property('_maxListeners', 10);
        });
    });
    
    describe('.classify(props, [properties])', function () {
        it('should return a constructor function', function () {
            Foo.should.be.function;
            (new Foo()).should.be.an.instanceof(Foo);
        });
        
        it('should correctly call the constructor function', function () {
            (new Foo('foo')).foo.should.equal('foo');
        });
        
        it('should have an \'extend\' method', function () {
            Foo.extend.should.be.function;
        });

        it(
            'should have a \'superproto\' property that points to the superclass\'s prototype',
            function () {
                Foo.superproto.should.equal(Object.prototype);
            }
        );
        
        it('extending a class should be an instance of the superclass', function () {
            var Bar = Foo.extend({});
            Bar.superproto.should.equal(Foo.prototype);
            (new Bar()).should.be.an.instanceof(Bar);
            (new Bar()).should.be.an.instanceof(Foo);
        });
    });
    
});
