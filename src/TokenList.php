<?php

namespace CapyLexer
{
  use \ReflectionClass;

  class TokenList
  {
    const T_MODULE      = "T_MODULE";
    const T_IMPORT      = "T_IMPORT";
    const T_EXPORT      = "T_EXPORT";
    const T_BLOCK       = "T_BLOCK";
    const T_WHERE       = "T_WHERE";
    const T_DECLARE     = "T_DECLARE";
    const T_IS          = "T_IS";
    const T_SUBMODULE   = "T_SUBMODULE";
    const T_HASH        = "T_HASH";
    const T_SEMICOLON   = "T_SEMICOLON";
    const T_IDENT       = "T_IDENT";
    const T_NEWLINE     = "T_NEWLINE";
    const T_STRING      = "T_STRING";
    const T_TOKEN       = "T_TOKEN";
    const T_LBRACE      = "T_LBRACE";
    const T_RBRACE      = "T_RBRACE";
    const T_INSTRUCTION = "T_INSTRUCTION";
    const T_COMMA       = "T_COMMA";
    const T_DOT         = "T_DOT";
    const T_TYPESIG     = "T_TYPESIG";
    const T_RANGE       = "T_RANGE";
    const T_COLON       = "T_COLON";
    const T_LBRACK      = "T_LBRACK";
    const T_RBRACK      = "T_RBRACK";
    const T_NUMBER      = "T_NUMBER";
    const T_YES         = "T_YES";
    const T_NO          = "T_NO";
    const T_NOTHING     = "T_NOTHING";
    const T_OTHER       = "T_OTHER";
    const T_TRANSLATES  = "T_TRANSLATES";
    const T_PLACEHOLDER = "T_PLACEHOLDER";

    static $keywordMap = [
      "Module"    => TokenList::T_MODULE
    , "Import"    => TokenList::T_IMPORT
    , "Export"    => TokenList::T_IMPORT
    , "Block"     => TokenList::T_BLOCK
    , "SubModule" => TokenList::T_SUBMODULE
    , "Where"     => TokenList::T_WHERE
    , "Is"        => TokenList::T_IS
    , "Token"     => TokenList::T_TOKEN
    , "Yes"       => TokenList::T_YES
    , "No"        => TokenList::T_NO
    , "Nothing"   => TokenList::T_NOTHING
    , "Declare"   => TokenList::T_DECLARE
    ];

    public static function getTokenName($tokenValue)
    {
      return (new ReflectionClass(__CLASS__))->getConstants()[$tokenValue];
    }
  }
}