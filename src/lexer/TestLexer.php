<?php

namespace CapyLexer
{
  require_once "TokenList.php";
  require_once "Token.php";
  require_once "Assertion.php";
  require_once "Lexer.php";
  require_once "Tokenizer.php";

  function testLexer($file)
  {
    $source = file_get_contents($file);

    $lexer = new Tokenizer($source);
    $token = $lexer->nextToken();

    while ($token->getKey() != Lexer::T_EOF) {
      echo $token;
      $token = $lexer->nextToken();
    }
  }

  testLexer($argv[1]);
}