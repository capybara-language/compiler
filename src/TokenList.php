<?php

namespace CapyLexer
{
  class TokenList
  {
    const T_MODULE      = 2;
    const T_IMPORT      = 3;
    const T_EXPORT      = 4;
    const T_BLOCK       = 5;
    const T_WHERE       = 6;
    const T_DECLARE     = 7;
    const T_IS          = 8;
    const T_SUBMODULE   = 9;
    const T_HASH        = 10;
    const T_SEMICOLON   = 11;
    const T_IDENT       = 12;
    const T_NEWLINE     = 13;
    const T_BEGINSTR    = 14;
    const T_ENDSTR      = 15;
    const T_TOKEN       = 16;
    const T_LBRACE      = 17;
    const T_RBRACE      = 18;
    const T_INSTRUCTION = 19;
    const T_COMMA       = 20;
    const T_DOT         = 21;
    const T_TYPESIG     = 22;
    const T_RANGE       = 23;
    const T_COLON       = 24;
    const T_LBRACK      = 25;
    const T_RBRACK      = 26;
    const T_NUMBER      = 27;
    const T_YES         = 28;
    const T_NO          = 29;

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
    ];
  }
}