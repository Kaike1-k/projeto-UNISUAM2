<?php	
	include("conexao.php");	
	
	//	Recebendo	dados	do	formulário	
	$nome	=	$_POST['nome'];	
	$conta	=	$_POST['conta'];	
	$data	=	$_POST['data'];	
	$cpf	=	$_POST['cpf'];	
	
	//	Preparando	comando	SQL	
	$sql	=	"INSERT	INTO clientes (nome,	conta,	data_nascimento, cpf) VALUES	(?,	?,	?,	?)";	
	
	//	Usando	prepared	statement	para	segurança	
	$stmt	=	$conexao->prepare($sql);	
	$stmt->bind_param("ssss",	$nome,	$conta,	$data,	$cpf);	
	
	if	($stmt->execute())	{	
		echo	"✅cadastrado	com	sucesso!";	
	}	else	{	
		echo	"❌	Erro:	"	.	$stmt->error;	
	}	
	
	$stmt->close();	
	$conexao->close();	
?>	