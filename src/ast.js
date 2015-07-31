{
  /**
   * Capybara compiler
   * Copyright 2015 - Marcelo Camargo <marcelocamargo@linuxmail.org>
   * Licensed under GNU GPL v3.
   */
  var Capybara = {
    declaration: {
      declare: function(key, value) {
        Persistent.declarations[key] = value;
      },
      undeclare: function(key) {
        delete Persistent.declarations[key];
      },
      exists: function(key) {
        return key in Persistent.declarations;
      }
    },
    type: {
      toInteger: function(digits) {
        return parseInt(digits.join(""));
      },
      toString: function(chars) {
        return chars.join("").toString();
      }
    },
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
  };

  var Persistent = {
    moduleName: undefined,
    declarations: {}
  };
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

Stmt "statement"
  = ModuleStmt
  / DeclareStmt

/* Statements */
ModuleStmt
  = ModuleToken _ name:Ident _ StmtTerminator {
    if (!Persistent.moduleName) {
      Persistent.moduleName = name.name;
    } else {
      throw new SyntaxError("Module is immutable and cannot be redefined to " +
      "\"" + name.name + "\".");
    }

    return {
      type: "ModuleStmt",
      name: name.name
    }
  }

DeclareStmt
  = DeclareToken _ variable:Ident _ AsToken _ expr:Expr _ StmtTerminator {

    if (Capybara.declaration.exists(variable.name)) {
      throw new SyntaxError("Cannot redefine \"" + variable.name + "\"");
    }

    Capybara.declaration.declare(variable.name, true);

    return {
      type: "DeclareStmt",
      key: variable.name,
      value: expr
    };
  }

StmtTerminator "statement terminator ([.] or [;])"
  = ("." / ";") _

/* Expressions */
Expr "expression"
  = Literal

Literal
  = CapybaraString
  / CapybaraInteger
  / CapybaraBool

CapybaraString
  = "{:" str:ValidStringChar* ":}" {
    return {
      type: "Literal",
      kind: "String",
      value: Capybara.type.toString(str)
    };
  }

CapybaraInteger
  = i:[0-9]+ {
    return {
      type: "Literal",
      kind: "Integer",
      value: parseInt(i.join(""))
    };
  }

CapybaraBool
  = YesToken {
    return {
      type: "Literal",
      kind: "Bool",
      value: true
    };
  }
  / NoToken {
    return {
      type: "Literal",
      kind: "Bool",
      value: false
    };
  }

/* Tokens */
KeyWord "reserved word"
  = ModuleToken
  / DeclareToken
  / AsToken
  / YesToken
  / NoToken

ModuleToken
  = "Module" !IdentRest

DeclareToken
  = "Declare" !IdentRest

AsToken
  = "As" !IdentRest

YesToken
  = "Yes" !IdentRest

NoToken
  = "No" !IdentRest

/* Identifier */
Ident "identifier"
  = !KeyWord name:IdentName _ {
    return name;
  }

IdentName
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

ValidStringChar
  = [a-z_0-9_\-\/\^\~\!\@\#\$\%\&\*\(\)\+\{\}\?\,\.\<\>\t\s ]i

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
