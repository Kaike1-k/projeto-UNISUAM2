<?php	
	//	Configurações	de	conexão	com	o	MySQL	
	$servidor	=	"localhost";		//	geralmente	localhost	no	XAMPP	
	$usuario		=	"root";							//	usuário	padrão	do	MySQL	no	XAMPP	
	$senha				=	"";											//	senha	padrão	é	vazia,	a	não	ser	que	você	tenha	alterado	
	$banco				=	"cadastros";	//	nome	do	seu	banco	de	dados	
	
	//	Criando	a	conexão	
	$conexao	=	new	mysqli($servidor,	$usuario,	$senha,	$banco);	
	
	//	Verificando	conexão	
	if	($conexao->connect_error)	{	
		die("Erro	na	conexão:	"	.	$conexao->connect_error);	
	}
?>	