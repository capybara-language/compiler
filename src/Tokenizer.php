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
          case ".":
            $this->consume();
            return new Token(TokenList::T_DOT);
          case " ":
            $this->solveWhitespace();
            continue;
          case PHP_EOL:
            $this->solveNewline();
          case "{":
            return $this->solveLeftBrace();
          default:
            if (Assertion::assertAlpha($this->char)) {
              return $this->solveIdentifier();
            }

            throw new \Exception("Token nao reconhecido: " . $this->char);
        }
      }
      return new Token(Lexer::T_EOF);
    }

    public function solveIdentifier()
    {
      echo "Resolvendo identificador", PHP_EOL;

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

    public function solveWhitespace()
    {
      while ($this->char === " ") {
        $this->consume();
      }
    }

    public function solveNewline()
    {
      $CRLF = ["\r", "\n", "\r\n"];
      while (in_array($this->char, $CRLF)) {
        $this->consume();
      }
      return new Token(TokenList::T_NEWLINE);
    }

    public function solveLeftBrace()
    {
      if ($this->matchNext("{:")) {
        $this->consume(2);
        return new Token(TokenList::T_BEGINSTR);
      }
      $this->consume();
      return new Token(TokenList::T_LBRACE);
    }
  }
}