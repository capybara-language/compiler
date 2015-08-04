## Capybara Programming Language

**Capybara** is a domain specific language that targets **ZPL**.
It contains the following features:

- **Extensible** - You can extend the language and its tokens natively. The
compiler supports special symbols to abstract the domain of your problem.
- **Primitive Type System** - Capybara has four primitive types: `Any`, `String`,
`Integer` and `Bool`.
- **Range Based Type System** - Following **Idris** concepts, **Capybara** has
integers from 0 to 10, 10 to 20 and your range, with a compile time type check.
- **Declarative** - Don't say how to do, neither what to do. Say where to do.
- **Modular** - A simple module system highly organized.
- **Immutability** - Declarations are immutable unless specified.

### Example

#### Hello World!

```groovy
Module HelloWorld.
Import StdPrint { field, font, label }.

Declare text :: String
  := {:Hello World!:}.

Export Block main
  label#begin,
  field#origin [ 100, 150 ],
  font#sizing  [ 90,  50  ],
  field#data   [ text     ],
  field#sep,
  label#end.
```

Generates:

```php
^XA^FO100,150^ADN90,50^FDHello World^FS^XZ
```

That outputs:

![Hello World!](https://raw.githubusercontent.com/haskellcamargo/capybara/master/helloworld.png)

You can try the generated ZPL code here: (Labelary Online ZPL Viewer)[http://labelary.com/viewer.html].
