## Capybara Programming Language

Capybara is a statically typed, metaprogrammable, declarative, dependently typed
programming language that compiles to ZPL. Capybara is just a rename of Ink programming language.

### Examples

#### Hello World (With imported modules)

```erlang
Module HelloWorld.
Import StdPrint { label ; field ; font }
       StdToken { / }.
Export hello.

% Hello world with the standard IO library!
Block hello Where
  label#begin
  field#origin [ 100, 150 ]
  font#default
  field#data [ {: Hello World:} ]; /
  label#end.
```

Generates:

```php
^FX Hello world with the standard IO library!
^XA
^FO20,10^ADN100,150^FDHello World^FS
^XZ
```

That outputs:

(TODO: ADD IMAGE)

#### Hello World (With manual type definition)

```erlang
Module HelloWorld.

Token { / } Is ^FS.

Declare
  helloText Is {: Hello World! :}.

SubModule label Where begin ~ ^XA, end ~ XZ.
SubModule field Where
  origin: [ x: Int [ 18 .. 180 ], y: Int [ 10 .. 100 ] ] ~ ^FO{x}{y}
  data: [ content: String ] ~ ^FD{content}.
SubModule font Where default ~ ^ADN9050.
  

Block hello Where
  label#begin
  field#origin [ 100, 150 ]
  font#default
  field#data   [ {: Hello World:} ]; /
  label#end.
```

You can try the generated ZPL code here: (Labelary Online ZPL Viewer)[http://labelary.com/viewer.html].
