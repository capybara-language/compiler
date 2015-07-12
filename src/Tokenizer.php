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
          case "\r\n":
          case "\r":
          case "\n":
            return $this->solveNewline();
          case ".":
            $this->consume();
            return new Token(TokenList::T_DOT);
          default:
            if (Assertion::assertAlpha($this->char)) {
              return $this->solveIdentifier();
            }
            throw new \Exception("Unexpected {$this->char}", 1);
        }
      }
    }

    public function solveIdentifier()
    {
      $stack = [];
      while (Assertion::assertAlphaNum($this->char)
        || Assertion::assertUnderscore($this->char)) {
        $stack[] = $this->char;
        $this->consume();
      }
      $buffer = implode("", $stack);

      if (array_key_exists($buffer, TokenList::$keywordMap)) {
        return new Token(TokenList::$keywordMap[$buffer]);
      }
      return new Token(TokenList::T_IDENT, $buffer);
    }

    public function solveWhitespace()
    {
      while ($this->char === " ") {
        $this->consume();
      }
    }

    public function solveNewline()
    {
      
    }
  }
}