<?php

namespace CapyLexer
{
  class Tokenizer extends Lexer
  {
    public function __construct($input)
    {
      parent::__construct($input);
    }

    public function nextToken()
    {
      while ($this->char != self::EOF) {
        switch ($this->char) {
          case " ":
            $this->solveWhitespace();
            continue;
          case ".":
            return $this->solveDot();
          case "{":
            return $this->solveLeftBrace();
          case "^":
            $this->consume();
            return new Token(TokenList::T_INSTRUCTION);
          case "~":
            $this->consume();
            return new Token(TokenList::T_TRANSLATES);
          case ",":
            $this->consume();
            return new Token(TokenList::T_COMMA);
          case ":":
            $this->consume();
            return new Token(TokenList::T_TYPESIG);
          case "[":
            $this->consume();
            return new Token(TokenList::T_LBRACK);
          case "]":
            $this->consume();
            return new Token(TokenList::T_RBRACK);
          case "#":
            $this->consume();
            return new Token(TokenList::T_HASH);
          case ";":
            $this->consume();
            return new Token(TokenList::T_SEMICOLON);
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
      return new Token(Lexer::T_EOF);
    }

    private function solveIdent()
    {
      $buffer = "";
      while (Assertion::assertAlphaNum($this->char)
        || Assertion::assertUnderscore($this->char)) {
        $buffer .= $this->char;
        $this->consume();
      }

      if (array_key_exists($buffer, TokenList::$keywordMap)) {
        return new Token(TokenList::$keywordMap[$buffer]);
      }
      return new Token(TokenList::T_IDENT, $buffer);
    }

    private function solveWhitespace()
    {
      while (in_array($this->char, [" ", "\t"])) {
        $this->consume();
      }
    }

    private function solveNewline()
    {
      while (Assertion::assertNewline($this->char)) {
        $this->consume();
      }
      return new Token(TokenList::T_NEWLINE);
    }

    private function solveLeftBrace()
    {
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
          $placeholder->getValue());
      }

      $this->consume();
      return new Token(TokenList::T_LBRACE);
    }

    private function parseString()
    {
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
      return new Token(TokenList::T_STRING, $string);
    }

    private function parseToken()
    {
      $this->consume(2);
      $token = "";

      while (!$this->matchNext("?}")) {
        $token .= $this->char;

        $this->consume();
        if ($this->char === parent::EOF) {
          throw new \Exception("Unterminated token");
        }
      }
      $this->consume(2);
      return new Token(TokenList::T_OTHER, str_replace(" ", "", $token));
    }

    private function solveNumber()
    {
      $buffer = "";
      while (Assertion::assertNum($this->char)) {
        $buffer .= $this->char;
        $this->consume();
      }
      return new Token(TokenList::T_NUMBER, $buffer);
    }

    private function solveDot()
    {
      if ($this->next() === ".") {
        $this->consume(2);
        return new Token(TokenList::T_RANGE);
      }
      $this->consume();
      return new Token(TokenList::T_DOT);
    }
  }
}