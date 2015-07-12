<?php

namespace CapyLexer
{
  class Tokenizer extends Lexer
  {
    public $metaToken = [];

    public function __construct($input)
    {
      parent::__construct($input);
    }

    public function nextToken()
    {
      while ($this->char != self::EOF) {
        $local = $this->local;

        if (in_array($this->char, $this->metaToken)) {
          $metachar = $this->char;
          $this->consume();
          return new Token(TokenList::T_META, $metachar, $local);
        }

        switch ($this->char) {
          case " ":
            $this->solveWhitespace();
            continue;
          case ".":
            return $this->solveDot();
          case "{":
            return $this->solveLeftBrace();
          case "}":
            return $this->solveRightBrace();
          case "^":
            return $this->solveInstruction();
          case "~":
            $this->consume();
            return new Token(TokenList::T_TRANSLATES, $local);
          case ",":
            $this->consume();
            return new Token(TokenList::T_COMMA, $local);
          case ":":
            $this->consume();
            return new Token(TokenList::T_TYPESIG, $local);
          case "[":
            $this->consume();
            return new Token(TokenList::T_LBRACK, $local);
          case "]":
            $this->consume();
            return new Token(TokenList::T_RBRACK, $local);
          case "#":
            $this->consume();
            return new Token(TokenList::T_HASH, $local);
          case ";":
            $this->consume();
            return new Token(TokenList::T_SEMICOLON, $local);
          default:

            if (Assertion::assertAlpha($this->char)) {
              return $this->solveIdent();
            }

            if (Assertion::assertNum($this->char)) {
              return $this->solveNumber();
            }

            if (Assertion::assertNewline($this->char)) {
              return $this->solveNewline();
            }

            throw new \Exception("Invalid: " . $this->char);
        }
      }
      return new Token(Lexer::T_EOF, $this->local);
    }

    private function solveIdent()
    {
      $buffer = "";
      $local = $this->local;
      while (Assertion::assertAlphaNum($this->char)
        || Assertion::assertUnderscore($this->char)) {
        $buffer .= $this->char;
        $this->consume();
      }

      if (array_key_exists($buffer, TokenList::$keywordMap)) {
        return new Token(TokenList::$keywordMap[$buffer], $local);
      }
      return new Token(TokenList::T_IDENT, $buffer, $local);
    }

    private function solveWhitespace()
    {
      while (in_array($this->char, [" ", "\t"])) {
        $this->consume();
      }
    }

    private function solveNewline()
    {
      $local = $this->local;
      while (Assertion::assertNewline($this->char)) {
        $this->consume();
        $this->local["line"]++;
        $this->local["column"] = 1;
      }
      return new Token(TokenList::T_NEWLINE, $local);
    }

    private function solveLeftBrace()
    {
      $local = $this->local;
      if ($this->matchNext("{:")) {
        return $this->parseString();
      }

      if ($this->matchNext("{?")) {
        return $this->parseToken();
      }

      if (Assertion::assertAlpha($this->next())) {
        $this->consume();

        $placeholder = $this->solveIdent();
        if ($this->char !== "}") {
          throw new \Exception("Unterminated placeholder");
        }
        $this->consume();
        return new Token(TokenList::T_PLACEHOLDER,
          $placeholder->getValue(), $local);
      }

      $this->consume();
      return new Token(TokenList::T_LBRACE, $local);
    }

    private function solveRightBrace()
    {
      $local = $this->local;
      $this->consume();
      return new Token(TokenList::T_RBRACE, $local);
    }

    private function parseString()
    {
      $local = $this->local;
      $this->consume(2);
      $string = "";

      while (!$this->matchNext(":}")) {
        $string .= $this->char;

        $this->consume();
        if ($this->char === parent::EOF) {
          throw new \Exception("Unterminated string");
        }
      }
      $this->consume(2);
      return new Token(TokenList::T_STRING, $string, $local);
    }

    private function parseToken()
    {
      $this->consume(2);
      $token = "";
      $local = $this->local;
      $rWhitespace = 0;

      while (!$this->matchNext("?}")) {
        $token .= $this->char;

        $this->consume();
        if ($this->char === parent::EOF) {
          throw new \Exception("Unterminated token");
        }
      }
      $this->consume(2);

      $meta = str_replace(" ", "", $token);

      for ($i = 0, $l = strlen($token); $i < $l; $i++) {
        if ($token[$i] === " ") {
          $rWhitespace++;
        } else {
          break;
        }
      }

      $this->metaToken[] = $meta;
      $local["column"] += $rWhitespace;

      return new Token(TokenList::T_METADEF, $meta, $local);
    }

    private function solveNumber()
    {
      $buffer = "";
      $local = $this->local;
      while (Assertion::assertNum($this->char)) {
        $buffer .= $this->char;
        $this->consume();
      }
      return new Token(TokenList::T_NUMBER, $buffer, $local);
    }

    private function solveDot()
    {
      $local = $this->local;
      if ($this->next() === ".") {
        $this->consume(2);
        return new Token(TokenList::T_RANGE, $local);
      }
      $this->consume();
      return new Token(TokenList::T_DOT, $local);
    }

    private function solveInstruction()
    {
      $local = $this->local;
      $this->consume();
      return new Token(TokenList::T_INSTRUCTION, $local);
    }
  }
}