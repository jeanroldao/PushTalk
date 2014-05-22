
function statistics() {
  //tabelaHorarios
  var linhasCadastradas = {};
  for (var i = 0; i < tabelaHorarios.length; i++ ) {
    if (!linhasCadastradas[tabelaHorarios[i].linha]) {
      linhasCadastradas[tabelaHorarios[i].linha] = 0;
    }
    linhasCadastradas[tabelaHorarios[i].linha]++;
  }
  return linhasCadastradas;
}

function getDias() {
  var linhasCadastradas = {};
  for (var i = 0; i < tabelaHorarios.length; i++ ) {
    if (!linhasCadastradas[tabelaHorarios[i].dia]) {
      linhasCadastradas[tabelaHorarios[i].dia] = 0;
    }
    linhasCadastradas[tabelaHorarios[i].dia]++;
  }
  return linhasCadastradas;
}

function busca(filtro) {
  //tabelaHorarios
  
  var listaFiltrada = [];
  for (var i = 0; i < tabelaHorarios.length; i++ ) {
    if (filtro(tabelaHorarios[i])) {
      listaFiltrada.push(tabelaHorarios[i]);
    }
  }
  listaFiltrada.sort(function(a,b){
    //return a.hora < b.hora;
    if (a.hora < b.hora) {
      return -1;
    } else if (a.hora > b.hora) {
      return 1;
    } else if(a.descricao < b.descricao) {
      return -1;
    } else if (a.descricao > b.descricao) {
      return 1;
    } else {
      return 0;
    }
  });
  return listaFiltrada;
}

function formatTime(time) {
	var horas = time.getHours();
	if (horas < 10) {
		horas = "0" + horas;
	}
	var minutos = time.getMinutes();
	if (minutos < 10) {
		minutos = "0" + minutos;
	}
	return horas + ":" + minutos;
}

$(function () {
  var txtPesquisar = $('#txtPesquisar');
  var txtHoraInicial = $('#txtHoraInicial');
  var txtHoraFinal = $('#txtHoraFinal');
  var selectDia = $('#selectDia');
  var optSentido = $('.optSentido');
  var selectLinhas = $('#selectLinhas');
  var btnPesquisar = $('#btnPesquisar');
  
  var horaini = new Date();
  horaini.setHours(horaini.getHours()-1);
  txtHoraInicial.val(formatTime(horaini));
  
  var horafim = new Date();
  horafim.setHours(horafim.getHours() + 1);
  
  txtHoraFinal.val(formatTime(horafim));

  var linhas = Object.keys(statistics()).sort();
  
  for (var iLinha in linhas) {
	var linha = linhas[iLinha];
    var optionLinha = document.createElement('option');
    optionLinha.value = linha;
    optionLinha.text = linha;
    selectLinhas.append(optionLinha);
  }
  
  btnPesquisar.click(function() {
  
    var selecao = selectLinhas.val() || [];
	
    var resultado = [];
	var sentido = $('.optSentido:checked').val();
	if (txtHoraInicial.val() < txtHoraFinal.val()) {
		resultado = busca(function(item){
      
		  return (item.descricao.toLowerCase().indexOf(txtPesquisar.val().toLowerCase()) != -1)
			  && (selecao.length == 0 || selecao.indexOf(item.linha) != -1)
			  && item.dia == selectDia.val()
			  && item.sentido == sentido
			  && item.hora >= txtHoraInicial.val()
			  && item.hora <= txtHoraFinal.val();
		});
	} else {
		resultado = busca(function(item){
      
		  return (item.descricao.toLowerCase().indexOf(txtPesquisar.val().toLowerCase()) != -1)
			  && (selecao.length == 0 || selecao.indexOf(item.linha) != -1)
			  && item.dia == selectDia.val()
			  && item.sentido == sentido
			  && item.hora >= txtHoraInicial.val();
		});
		
		resultado = resultado.concat(busca(function(item){
      
		  return (item.descricao.toLowerCase().indexOf(txtPesquisar.val().toLowerCase()) != -1)
			  && (selecao.length == 0 || selecao.indexOf(item.linha) != -1)
			  && item.dia == selectDia.val()
			  && item.sentido == sentido
			  && item.hora <= txtHoraFinal.val()
			  && item.hora <= txtHoraFinal.val();
		}));
	}
    //console.log(resultado);
    montaGrid(resultado);
  });
  
});

function montaGrid(lista) {

  var table = getTable();
  if (lista.length == 0) {
    criaLinha(table, ['<b>Sem linhas para essa pesquisa, mude o filtro para resultados diferentes</b>']);
  } else {
  
	var total_linhas = lista.length;
    var tr = document.createElement('tr');
    //var th = document.createElement('th');
	var prural = total_linhas == 1 ? '' : 's';
	tr.innerHTML = '<th colspan="3">' + total_linhas + ' linha'+prural+' encontrada'+prural+'</th>';
	$('thead', table).append(tr);
	//criaLinha(table, ['', '', total_linhas + ' linhas encontradas']);
    criaLinha(table, ['Hora', 'Linha', 'Descri&ccedil;&atilde;o'], 'thead');
    for (var i = 0; i < total_linhas; i++) {
      var linha = lista[i];
      criaLinha(table, [linha.hora, linha.linha, linha.descricao]);
    }
  }
}

var table = null;
function getTable() {
  if (table != null) {
    table.parentNode.removeChild(table);
  }
  table = document.createElement('table');
  table.className = 'table table-bordered';
  table.appendChild(document.createElement('thead'));
  table.appendChild(document.createElement('tbody'));
  //table.border = "1";
  $('#conteudo').append(table);
  return table;
}

function criaLinha(table, campos, tablePart) {
  tablePart = tablePart || 'tbody';
  var tr = document.createElement('tr');
  for (var i = 0; i < campos.length; i++) {
    var td = document.createElement(tablePart == 'tbody' ? 'td' : 'th');
    if (typeof campos[i] != 'object') {
      td.innerHTML = campos[i];
    } else {
      td.appendChild(campos[i]);
    }
    tr.appendChild(td);
  }
  $(tablePart, table).append(tr);
}
