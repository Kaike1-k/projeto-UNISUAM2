<?php	
	include("conexao.php");	
	
	//	Recebendo	dados	do	formulário	
	$nome	=	$_POST['nome'];	
	$conta	=	$_POST['conta'];	
	$senha	=   $_POST['senha'];
	$data	=	$_POST['data'];	
	$cpf	=	$_POST['cpf'];	
	$sexo	=   $_POST['sexo'];
	$nomemae = $_POST['nomemae'];
	$cep  =  $_POST[' cep'];
	$endereco  =  $_POST['endereço'];
	$email  =  $_POST['email'];
	$telefone  =  $_POST['telefone'];
	//	Preparando	comando	SQL	
	$sql	=	"INSERT	INTO users (nome,	conta, senha, data_nascimento, cpf, sexo, nome_mãe, cep, endereço, email, telefone) 
				 VALUES	(?,	?,	?,	?, ?, ?, ?, ?, ?, ?, ?)";	
	
	//	Usando	prepared	statement	para	segurança	
	$stmt	=	$conexao->prepare($sql);	
	$stmt->bind_param("sssssssssss",	$nome,	$conta, $senha,	$data,	$cpf, $sexo, $nomemae, $cep, $endereco, $email, $telefone);	
	
	if	($stmt->execute())	{	
		echo	"✅cadastrado	com	sucesso!";	
	}	else	{	
		echo	"❌	Erro:	"	.	$stmt->error;	
	}	
	
	$stmt->close();	
	$conexao->close();	
?>	