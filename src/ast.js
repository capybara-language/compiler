{
  /**
   * Capybara compiler
   * Copyright 2015 - Marcelo Camargo <marcelocamargo@linuxmail.org>
   * Licensed under GNU GPL v3.
   */
  var Capybara = {
    list: {
      build: function(x, xs, n) {
        return [x].concat(Capybara.list.take(xs, n));
      },
      take: function(xs, n) {
        var result = new Array(xs.length);

        for (var i = 0, len = xs.length; i < len; i++) {
          result[i] = xs[i][n];
        }

        return result;
      },
      takeOpt: function(opt, index) {
        return opt ? opt[index] : null;
      },
      opt: function(value) {
        return value !== null ? value : [];
      },
      stringify: function(x, xs) {
        return [x].concat(xs).join("");
      }
    }
  }
}

Start
  = _ code:Program {
    return code;
  }

Program
  = body:Body? {
    return {
      type: "Program",
      body: Capybara.list.opt(body)
    };
  }

Body
  = x:Stmt xs:(_ Stmt)* {
    return Capybara.list.build(x, xs, 1);
  }

Stmt
  = Ident

/* Tokens */
KeyWord
  = ModuleToken

ModuleToken
  = "Module"

/* Identifier */
Ident
  = !KeyWord name:IdentName _ {
    return name;
  }

IdentName "identifier"
  = x:IdentStart xs:IdentRest* {
    return {
      type: "Ident",
      name: Capybara.list.stringify(x, xs)
    };
  }

IdentStart
  = [a-z_]i

IdentRest
  = [a-z0-9_]i

/* Skipped */
_
  = (WhiteSpace / NewLine)*

WhiteSpace "whitespace"
  = "\t"
  / "\v"
  / "\f"
  / " "

NewLine "newline"
  = "\n"
  / "\r\n"
  / "\r"
  / "\u2028"
  / "\u2029"
