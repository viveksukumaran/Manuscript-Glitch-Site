//
// Assorted javascript to augment signup.html
//
// jQuery is available for use.

$(function(){
  
  // Populate the hidden timezone field with the client's timezone offset.
  var tzOffset = (new Date()).getTimezoneOffset();
  var input = document.getElementsByClassName('js-timezone')[0];
  input.value = tzOffset;
  
  $('input[name="00N7F00000QXWA1"]').val((name = new RegExp('(?:^|;\\s*)gclid=([^;]*)').exec(document.cookie)) ?  name.split(",")[1] : "");
  
  function subdomainResponses(resp) {
    var message = "";
    switch (resp) {
      case "available":
        message = "🔰 This team name is available! 👍";
        break;
      case "taken":
        message = "❌ This team name is in use 😟";
        break;
      case "invalid":
        message = "❗️ This is not a valid Manuscript team name 🙅 <br/>  <span class='note'>Team names can contain letters, numbers, and hyphens ('-'), <br/> but cannot start or end with a hyphen.</span>";
        break;
      case "empty":
        message = "💮 Please choose a Manuscript team name 💫";
        break;
      default:
        message = "🚫 Error, try again 🙅";
        break;
    }
    return {resp, message};
  }
   
  function displayErrors(errors) {
    // If the error has a 'field' property, put it on the field of that name
    // otherwise, put it in the banner above.
    errors.forEach(function(err) {
      if (err.field == null) {
        $(".Form__field-note.global").empty();
        $(".Form__field-note.global").append(err.error);
      } else {
        $(".Form__field-note."+err.field).empty();
        if (err.field == "subdomain") {
          var message = subdomainResponses(err.error).message;
          $(".Form__field-note."+err.field).parent().addClass("has-error");
          $(".Form__field-note."+err.field).append(message);
        } else {
          $(".Form__field-note."+err.field).parent().addClass("has-error");
          $(".Form__field-note."+err.field).append(err.error);
        }
      }
    })
    console.log("Errors", errors);
  }
  
  //as-you-type checking of URL validity and availability
  $('.URLInputGroup__input').keyup(function () { 
    var name = encodeURIComponent($('input[name=subdomain]').val());
    $.get("/signup/name-check?name="+ name, function(resp) {
      var status = subdomainResponses(resp.status);
      $(".Form__field-note.subdomain").removeClass().addClass('Form__field-note subdomain ' + status.resp);
      $(".Form__field-note.subdomain").empty().append(status.message); 
    });
  });
  
  function checkForBannedEmails() {
    $(".Form__field-note.email").empty();
    $(".Form__field-note.email").parent().removeClass("has-error");
    var email = $("input[type=email]").val().split("@")[1];
    $.get("https://raw.githubusercontent.com/willwhite/freemail/master/data/disposable.txt", function(result) {
      var domains = result.split(/\s+/);
      
      for (var i=0; i < domains.length; i++) {
        if (domains[i] == email) {
          $(".Form__field-note.email").parent().addClass("has-error");
          $(".Form__field-note.email").append("This address is not valid");
        }
      }
    })
  }
  
  
  function postToSalesForce(data) {
    var form = document.createElement("form");
    form.method = "POST";
    form.action = "https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8";
    form.setAttribute('target','hiddenSF');

    var elementOID = document.createElement("input");  
    elementOID.name="oid";
    elementOID.value='00D7F000006PTU1';
    elementOID.setAttribute("type", "hidden");
    form.appendChild(elementOID);

    var elementRetURL = document.createElement("input"); 
    elementRetURL.name="retURL";
    elementRetURL.value='https://www.manuscript.com/thank-you';
    elementRetURL.setAttribute("type", "hidden");
    form.appendChild(elementRetURL);

    var elementPhone = document.createElement("input"); 
    elementPhone.name="phone";
    elementPhone.value=(data.filter(item => item.name == 'phone').length === 1)? data.filter(item => item.name == 'phone')[0].value : '';
    elementPhone.setAttribute("type", "hidden");
    form.appendChild(elementPhone);
    
    var elementState = document.createElement("input"); 
    elementState.name="state_code";
    elementState.value=(data.filter(item => item.name == 'state_code').length === 1)? data.filter(item => item.name == 'state_code')[0].value : '';
    elementState.setAttribute("type", "hidden");
    form.appendChild(elementState);
    
    var elementCountry = document.createElement("input"); 
    elementCountry.name="country_code";
    elementCountry.value=(data.filter(item => item.name == 'country_code').length === 1)? data.filter(item => item.name == 'country_code')[0].value : '';
    elementCountry.setAttribute("type", "hidden");
    form.appendChild(elementCountry);
    
    var elementGoogle = document.createElement("input"); 
    elementGoogle.name="00N7F00000QXWA1";
    elementGoogle.value=data.filter(item => item.name == '00N7F00000QXWA1')[0].value;
    elementGoogle.setAttribute("type", "hidden");
    form.appendChild(elementGoogle);
    
    var elementCompany = document.createElement("input"); 
    elementCompany.name="company";
    elementCompany.value=(data.filter(item => item.name == 'company').length === 1)? data.filter(item => item.name == 'company')[0].value : '';
    elementCompany.setAttribute("type", "hidden");
    form.appendChild(elementCompany); 
    
    var elementFirstName = document.createElement("input"); 
    elementFirstName.name="first_name";
    elementFirstName.value=(data.filter(item => item.name == 'first_name').length === 1)? data.filter(item => item.name == 'first_name')[0].value : '';
    elementFirstName.setAttribute("type", "hidden");
    form.appendChild(elementFirstName);  

    var elementLastName = document.createElement("input");  
    elementLastName.name="last_name";
    elementLastName.value=(data.filter(item => item.name == 'last_name').length === 1)? data.filter(item => item.name == 'last_name')[0].value : '';
    elementLastName.setAttribute("type", "hidden");
    form.appendChild(elementLastName);

    var elementEmail = document.createElement("input"); 
    elementEmail.name="email";
    elementEmail.value=(data.filter(item => item.name == 'email').length === 1)? data.filter(item => item.name == 'email')[0].value : '';
    elementEmail.setAttribute("type", "hidden");
    form.appendChild(elementEmail);  

    var typeEl = document.createElement("input"); 
    typeEl.name="00N7F00000QVjCA";
    typeEl.value=(data.filter(item => item.name == '00N7F00000QVjCA').length === 1)? data.filter(item => item.name == '00N7F00000QVjCA')[0].value : '';
    typeEl.setAttribute("type", "hidden");
    form.appendChild(typeEl);
    
    var elementEmail = document.createElement("input"); 
    elementEmail.name="title";
    elementEmail.value=(data.filter(item => item.name == 'title').length === 1)? data.filter(item => item.name == 'title')[0].value : '';
    elementEmail.setAttribute("type", "hidden");
    form.appendChild(elementEmail);  
    
    document.body.appendChild(form);
    
    form.submit();
    
    window['dataLayer'].push({'event': 'trialformsuccess'});
  }
  
  $('#signup-form').submit(function(event){
    $('.TextInput').toggleClass("submitting");
    $('.Form__submit').empty().append("Submitting");
    event.preventDefault();
    checkForBannedEmails();
    var formData = $('#signup-form').serializeArray();
    var fullName = $('input[name="first_name"]').val() + ' ' + $('input[name="last_name"]').val();
    formData.push({ name: "full_name", value: fullName });
    var salesForceData = formData.filter(item => (item.name != 'password'));
    
    postToSalesForce(salesForceData);
 
    $.post('/signup', formData)
    .done(function(response){
      $('.TextInput').toggleClass("submitting");
      $('.Form__submit').empty().append("Let's Go!");
      console.log(response)
      var errors = response.errors;
      displayErrors(errors);
      var redirectUrl = response.redirectUrl;
      
      if(redirectUrl){
        window.location = redirectUrl;
        return;
      }
    })
    .fail(function(error){
      $('.TextInput').toggleClass("submitting");
      $('.Form__submit').empty().append("Let's Go!");
      $(".Form__field-note.global").append("Something went wrong, please try again");
    })
  });

  $('select[name="country_code"]').change(function(){
    var countrySelected = $(this).val();
    if(states[countrySelected] && states[countrySelected].length > 0){
      var select = $('select[name="state_code"]');
      if(select.prop) {
        var options = select.prop('options');
      }
      else {
        var options = select.attr('options');
      }

      var firstOption = options[0];
      $('option', select).remove();

      options[options.length] = firstOption;
      $.each(states[countrySelected], function(key, item) {
          options[options.length] = new Option(item.text, item.value);
      });

      $('select[name="state_code"]')
        .removeClass('TextInput--gray-light')
        .addClass('TextInput--yellow')
        .removeAttr('disabled')
        .prop('required', true)
        .val('');
    }else{
      $('select[name="state_code"]')
        .addClass('TextInput--gray-light')
        .removeClass('TextInput--yellow')
        .prop('disabled', true)
        .val('');
    }
  });

  var states = { AU: [], BR: [], CA: [], CN: [], HU: [], IN: [], IE: [], IT: [], US: [], MX: [], JP: [] };
  states['AU'].push({value:'ACT', text:"Australian Capital Territory"});
  states['AU'].push({value:'NSW', text:"New South Wales"});
  states['AU'].push({value:'NT', text:"Northern Territory"});
  states['AU'].push({value:'QLD', text:"Queensland"});
  states['AU'].push({value:'SA', text:"South Australia"});
  states['AU'].push({value:'TAS', text:"Tasmania"});
  states['AU'].push({value:'VIC', text:"Victoria"});
  states['AU'].push({value:'WA', text:"Western Australia"});
  states['BR'].push({value:'AC', text:"Acre"});
  states['BR'].push({value:'AL', text:"Alagoas"});
  states['BR'].push({value:'AM', text:"Amazonas"});
  states['BR'].push({value:'AP', text:"Amapá"});
  states['BR'].push({value:'BA', text:"Bahia"});
  states['BR'].push({value:'CE', text:"Ceará"});
  states['BR'].push({value:'DF', text:"Distrito Federal"});
  states['BR'].push({value:'ES', text:"Espírito Santo"});
  states['BR'].push({value:'GO', text:"Goiás"});
  states['BR'].push({value:'MA', text:"Maranhão"});
  states['BR'].push({value:'MG', text:"Minas Gerais"});
  states['BR'].push({value:'MS', text:"Mato Grosso do Sul"});
  states['BR'].push({value:'MT', text:"Mato Grosso"});
  states['BR'].push({value:'PA', text:"Pará"});
  states['BR'].push({value:'PB', text:"Paraíba"});
  states['BR'].push({value:'PE', text:"Pernambuco"});
  states['BR'].push({value:'PI', text:"Piauí"});
  states['BR'].push({value:'PR', text:"Paraná"});
  states['BR'].push({value:'RJ', text:"Rio de Janeiro"});
  states['BR'].push({value:'RN', text:"Rio Grande do Norte"});
  states['BR'].push({value:'RO', text:"Rondônia"});
  states['BR'].push({value:'RR', text:"Roraima"});
  states['BR'].push({value:'RS', text:"Rio Grande do Sul"});
  states['BR'].push({value:'SC', text:"Santa Catarina"});
  states['BR'].push({value:'SE', text:"Sergipe"});
  states['BR'].push({value:'SP', text:"São Paulo"});
  states['BR'].push({value:'TO', text:"Tocantins"});
  states['CA'].push({value:'AB', text:"Alberta"});
  states['CA'].push({value:'BC', text:"British Columbia"});
  states['CA'].push({value:'MB', text:"Manitoba"});
  states['CA'].push({value:'MYT', text:"Mayotte"});
  states['CA'].push({value:'NB', text:"New Brunswick"});
  states['CA'].push({value:'NL', text:"Newfoundland and Labrador"});
  states['CA'].push({value:'NS', text:"Nova Scotia"});
  states['CA'].push({value:'NT', text:"Northwest Territories"});
  states['CA'].push({value:'NU', text:"Nunavut"});
  states['CA'].push({value:'ON', text:"Ontario"});
  states['CA'].push({value:'PE', text:"Prince Edward Island"});
  states['CA'].push({value:'QC', text:"Quebec"});
  states['CA'].push({value:'SK', text:"Saskatchewan"});
  states['CA'].push({value:'YT', text:"Yukon Territories"});
  states['CN'].push({value:'11', text:"Beijing"});
  states['CN'].push({value:'12', text:"Tianjin"});
  states['CN'].push({value:'13', text:"Hebei"});
  states['CN'].push({value:'14', text:"Shanxi"});
  states['CN'].push({value:'15', text:"Nei Mongol"});
  states['CN'].push({value:'21', text:"Liaoning"});
  states['CN'].push({value:'22', text:"Jilin"});
  states['CN'].push({value:'23', text:"Heilongjiang"});
  states['CN'].push({value:'31', text:"Shanghai"});
  states['CN'].push({value:'32', text:"Jiangsu"});
  states['CN'].push({value:'33', text:"Zhejiang"});
  states['CN'].push({value:'34', text:"Anhui"});
  states['CN'].push({value:'35', text:"Fujian"});
  states['CN'].push({value:'36', text:"Jiangxi"});
  states['CN'].push({value:'37', text:"Shandong"});
  states['CN'].push({value:'41', text:"Henan"});
  states['CN'].push({value:'42', text:"Hubei"});
  states['CN'].push({value:'43', text:"Hunan"});
  states['CN'].push({value:'44', text:"Guangdong"});
  states['CN'].push({value:'45', text:"Guangxi"});
  states['CN'].push({value:'46', text:"Hainan"});
  states['CN'].push({value:'50', text:"Chongqing"});
  states['CN'].push({value:'51', text:"Sichuan"});
  states['CN'].push({value:'52', text:"Guizhou"});
  states['CN'].push({value:'53', text:"Yunnan"});
  states['CN'].push({value:'54', text:"Xizang"});
  states['CN'].push({value:'61', text:"Shaanxi"});
  states['CN'].push({value:'62', text:"Gansu"});
  states['CN'].push({value:'63', text:"Qinghai"});
  states['CN'].push({value:'64', text:"Ningxia"});
  states['CN'].push({value:'65', text:"Xinjiang"});
  states['CN'].push({value:'71', text:"Chinese Taipei"});
  states['CN'].push({value:'91', text:"Hong Kong"});
  states['CN'].push({value:'92', text:"Macao"});
  states['HU'].push({value:'BU', text:"Budapest"});
  states['IN'].push({value:'AN', text:"Andaman and Nicobar Islands"});
  states['IN'].push({value:'AP', text:"Andhra Pradesh"});
  states['IN'].push({value:'AR', text:"Arunachal Pradesh"});
  states['IN'].push({value:'AS', text:"Assam"});
  states['IN'].push({value:'BR', text:"Bihar"});
  states['IN'].push({value:'CH', text:"Chandigarh"});
  states['IN'].push({value:'CT', text:"Chhattisgarh"});
  states['IN'].push({value:'DD', text:"Daman and Diu"});
  states['IN'].push({value:'DL', text:"Delhi"});
  states['IN'].push({value:'DN', text:"Dadra and Nagar Haveli"});
  states['IN'].push({value:'GA', text:"Goa"});
  states['IN'].push({value:'GJ', text:"Gujarat"});
  states['IN'].push({value:'HP', text:"Himachal Pradesh"});
  states['IN'].push({value:'HR', text:"Haryana"});
  states['IN'].push({value:'JH', text:"Jharkhand"});
  states['IN'].push({value:'JK', text:"Jammu and Kashmir"});
  states['IN'].push({value:'KA', text:"Karnataka"});
  states['IN'].push({value:'KL', text:"Kerala"});
  states['IN'].push({value:'LD', text:"Lakshadweep"});
  states['IN'].push({value:'MH', text:"Maharashtra"});
  states['IN'].push({value:'ML', text:"Meghalaya"});
  states['IN'].push({value:'MN', text:"Manipur"});
  states['IN'].push({value:'MP', text:"Madhya Pradesh"});
  states['IN'].push({value:'MZ', text:"Mizoram"});
  states['IN'].push({value:'NL', text:"Nagaland"});
  states['IN'].push({value:'OR', text:"Odisha"});
  states['IN'].push({value:'PB', text:"Punjab"});
  states['IN'].push({value:'PY', text:"Puducherry"});
  states['IN'].push({value:'RJ', text:"Rajasthan"});
  states['IN'].push({value:'SK', text:"Sikkim"});
  states['IN'].push({value:'TN', text:"Tamil Nadu"});
  states['IN'].push({value:'TR', text:"Tripura"});
  states['IN'].push({value:'UP', text:"Uttar Pradesh"});
  states['IN'].push({value:'UT', text:"Uttarakhand"});
  states['IN'].push({value:'WB', text:"West Bengal"});
  states['IE'].push({value:'CE', text:"Clare"});
  states['IE'].push({value:'CN', text:"Cavan"});
  states['IE'].push({value:'CO', text:"Cork"});
  states['IE'].push({value:'CW', text:"Carlow"});
  states['IE'].push({value:'D', text:"Dublin"});
  states['IE'].push({value:'DL', text:"Donegal"});
  states['IE'].push({value:'G', text:"Galway"});
  states['IE'].push({value:'KE', text:"Kildare"});
  states['IE'].push({value:'KK', text:"Kilkenny"});
  states['IE'].push({value:'KY', text:"Kerry"});
  states['IE'].push({value:'LD', text:"Longford"});
  states['IE'].push({value:'LH', text:"Louth"});
  states['IE'].push({value:'LK', text:"Limerick"});
  states['IE'].push({value:'LM', text:"Leitrim"});
  states['IE'].push({value:'LS', text:"Laois"});
  states['IE'].push({value:'MH', text:"Meath"});
  states['IE'].push({value:'MN', text:"Monaghan"});
  states['IE'].push({value:'MO', text:"Mayo"});
  states['IE'].push({value:'OY', text:"Offaly"});
  states['IE'].push({value:'RN', text:"Roscommon"});
  states['IE'].push({value:'SO', text:"Sligo"});
  states['IE'].push({value:'TA', text:"Tipperary"});
  states['IE'].push({value:'WD', text:"Waterford"});
  states['IE'].push({value:'WH', text:"Westmeath"});
  states['IE'].push({value:'WW', text:"Wicklow"});
  states['IE'].push({value:'WX', text:"Wexford"});
  states['IT'].push({value:'AG', text:"Agrigento"});
  states['IT'].push({value:'AL', text:"Alessandria"});
  states['IT'].push({value:'AN', text:"Ancona"});
  states['IT'].push({value:'AO', text:"Aosta"});
  states['IT'].push({value:'AP', text:"Ascoli Piceno"});
  states['IT'].push({value:'AQ', text:"L'Aquila"});
  states['IT'].push({value:'AR', text:"Arezzo"});
  states['IT'].push({value:'AT', text:"Asti"});
  states['IT'].push({value:'AV', text:"Avellino"});
  states['IT'].push({value:'BA', text:"Bari"});
  states['IT'].push({value:'BG', text:"Bergamo"});
  states['IT'].push({value:'BI', text:"Biella"});
  states['IT'].push({value:'BL', text:"Belluno"});
  states['IT'].push({value:'BN', text:"Benevento"});
  states['IT'].push({value:'BO', text:"Bologna"});
  states['IT'].push({value:'BR', text:"Brindisi"});
  states['IT'].push({value:'BS', text:"Brescia"});
  states['IT'].push({value:'BT', text:"Barletta-Andria-Trani"});
  states['IT'].push({value:'BZ', text:"Bolzano"});
  states['IT'].push({value:'CA', text:"Cagliari"});
  states['IT'].push({value:'CB', text:"Campobasso"});
  states['IT'].push({value:'CE', text:"Caserta"});
  states['IT'].push({value:'CH', text:"Chieti"});
  states['IT'].push({value:'CI', text:"Carbonia-Iglesias"});
  states['IT'].push({value:'CL', text:"Caltanissetta"});
  states['IT'].push({value:'CN', text:"Cuneo"});
  states['IT'].push({value:'CO', text:"Como"});
  states['IT'].push({value:'CR', text:"Cremona"});
  states['IT'].push({value:'CS', text:"Cosenza"});
  states['IT'].push({value:'CT', text:"Catania"});
  states['IT'].push({value:'CZ', text:"Catanzaro"});
  states['IT'].push({value:'EN', text:"Enna"});
  states['IT'].push({value:'FC', text:"Forlì-Cesena"});
  states['IT'].push({value:'FE', text:"Ferrara"});
  states['IT'].push({value:'FG', text:"Foggia"});
  states['IT'].push({value:'FI', text:"Florence"});
  states['IT'].push({value:'FM', text:"Fermo"});
  states['IT'].push({value:'FR', text:"Frosinone"});
  states['IT'].push({value:'GE', text:"Genoa"});
  states['IT'].push({value:'GO', text:"Gorizia"});
  states['IT'].push({value:'GR', text:"Grosseto"});
  states['IT'].push({value:'IM', text:"Imperia"});
  states['IT'].push({value:'IS', text:"Isernia"});
  states['IT'].push({value:'KR', text:"Crotone"});
  states['IT'].push({value:'LC', text:"Lecco"});
  states['IT'].push({value:'LE', text:"Lecce"});
  states['IT'].push({value:'LI', text:"Livorno"});
  states['IT'].push({value:'LO', text:"Lodi"});
  states['IT'].push({value:'LT', text:"Latina"});
  states['IT'].push({value:'LU', text:"Lucca"});
  states['IT'].push({value:'MB', text:"Monza and Brianza"});
  states['IT'].push({value:'MC', text:"Macerata"});
  states['IT'].push({value:'ME', text:"Messina"});
  states['IT'].push({value:'MI', text:"Milan"});
  states['IT'].push({value:'MN', text:"Mantua"});
  states['IT'].push({value:'MO', text:"Modena"});
  states['IT'].push({value:'MS', text:"Massa and Carrara"});
  states['IT'].push({value:'MT', text:"Matera"});
  states['IT'].push({value:'NA', text:"Naples"});
  states['IT'].push({value:'NO', text:"Novara"});
  states['IT'].push({value:'NU', text:"Nuoro"});
  states['IT'].push({value:'OG', text:"Ogliastra"});
  states['IT'].push({value:'OR', text:"Oristano"});
  states['IT'].push({value:'OT', text:"Olbia-Tempio"});
  states['IT'].push({value:'PA', text:"Palermo"});
  states['IT'].push({value:'PC', text:"Piacenza"});
  states['IT'].push({value:'PD', text:"Padua"});
  states['IT'].push({value:'PE', text:"Pescara"});
  states['IT'].push({value:'PG', text:"Perugia"});
  states['IT'].push({value:'PI', text:"Pisa"});
  states['IT'].push({value:'PN', text:"Pordenone"});
  states['IT'].push({value:'PO', text:"Prato"});
  states['IT'].push({value:'PR', text:"Parma"});
  states['IT'].push({value:'PT', text:"Pistoia"});
  states['IT'].push({value:'PU', text:"Pesaro and Urbino"});
  states['IT'].push({value:'PV', text:"Pavia"});
  states['IT'].push({value:'PZ', text:"Potenza"});
  states['IT'].push({value:'RA', text:"Ravenna"});
  states['IT'].push({value:'RC', text:"Reggio Calabria"});
  states['IT'].push({value:'RE', text:"Reggio Emilia"});
  states['IT'].push({value:'RG', text:"Ragusa"});
  states['IT'].push({value:'RI', text:"Rieti"});
  states['IT'].push({value:'RM', text:"Rome"});
  states['IT'].push({value:'RN', text:"Rimini"});
  states['IT'].push({value:'RO', text:"Rovigo"});
  states['IT'].push({value:'SA', text:"Salerno"});
  states['IT'].push({value:'SI', text:"Siena"});
  states['IT'].push({value:'SO', text:"Sondrio"});
  states['IT'].push({value:'SP', text:"La Spezia"});
  states['IT'].push({value:'SR', text:"Syracuse"});
  states['IT'].push({value:'SS', text:"Sassari"});
  states['IT'].push({value:'SV', text:"Savona"});
  states['IT'].push({value:'TA', text:"Taranto"});
  states['IT'].push({value:'TE', text:"Teramo"});
  states['IT'].push({value:'TN', text:"Trento"});
  states['IT'].push({value:'TO', text:"Turin"});
  states['IT'].push({value:'TP', text:"Trapani"});
  states['IT'].push({value:'TR', text:"Terni"});
  states['IT'].push({value:'TS', text:"Trieste"});
  states['IT'].push({value:'TV', text:"Treviso"});
  states['IT'].push({value:'UD', text:"Udine"});
  states['IT'].push({value:'VA', text:"Varese"});
  states['IT'].push({value:'VB', text:"Verbano-Cusio-Ossola"});
  states['IT'].push({value:'VC', text:"Vercelli"});
  states['IT'].push({value:'VE', text:"Venice"});
  states['IT'].push({value:'VI', text:"Vicenza"});
  states['IT'].push({value:'VR', text:"Verona"});
  states['IT'].push({value:'VS', text:"Medio Campidano"});
  states['IT'].push({value:'VT', text:"Viterbo"});
  states['IT'].push({value:'VV', text:"Vibo Valentia"});
  states['JP'].push({value:'TKY', text:"Tokyo"});
  states['MX'].push({value:'AG', text:"Aguascalientes"});
  states['MX'].push({value:'BC', text:"Baja California"});
  states['MX'].push({value:'BS', text:"Baja California Sur"});
  states['MX'].push({value:'CH', text:"Chihuahua"});
  states['MX'].push({value:'CL', text:"Colima"});
  states['MX'].push({value:'CM', text:"Campeche"});
  states['MX'].push({value:'CO', text:"Coahuila"});
  states['MX'].push({value:'CS', text:"Chiapas"});
  states['MX'].push({value:'DF', text:"Federal District"});
  states['MX'].push({value:'DG', text:"Durango"});
  states['MX'].push({value:'GR', text:"Guerrero"});
  states['MX'].push({value:'GT', text:"Guanajuato"});
  states['MX'].push({value:'HG', text:"Hidalgo"});
  states['MX'].push({value:'JA', text:"Jalisco"});
  states['MX'].push({value:'ME', text:"Mexico State"});
  states['MX'].push({value:'MI', text:"Michoacán"});
  states['MX'].push({value:'MO', text:"Morelos"});
  states['MX'].push({value:'NA', text:"Nayarit"});
  states['MX'].push({value:'NL', text:"Nuevo León"});
  states['MX'].push({value:'OA', text:"Oaxaca"});
  states['MX'].push({value:'PB', text:"Puebla"});
  states['MX'].push({value:'QE', text:"Querétaro"});
  states['MX'].push({value:'QR', text:"Quintana Roo"});
  states['MX'].push({value:'SI', text:"Sinaloa"});
  states['MX'].push({value:'SL', text:"San Luis Potosí"});
  states['MX'].push({value:'SO', text:"Sonora"});
  states['MX'].push({value:'TB', text:"Tabasco"});
  states['MX'].push({value:'TL', text:"Tlaxcala"});
  states['MX'].push({value:'TM', text:"Tamaulipas"});
  states['MX'].push({value:'VE', text:"Veracruz"});
  states['MX'].push({value:'YU', text:"Yucatán"});
  states['MX'].push({value:'ZA', text:"Zacatecas"});
  states['US'].push({value:'AA', text:"Armed Forces Americas"});
  states['US'].push({value:'AE', text:"Armed Forces Europe"});
  states['US'].push({value:'AK', text:"Alaska"});
  states['US'].push({value:'AL', text:"Alabama"});
  states['US'].push({value:'AP', text:"Armed Forces Pacific"});
  states['US'].push({value:'AR', text:"Arkansas"});
  states['US'].push({value:'AS', text:"American Samoa"});
  states['US'].push({value:'AZ', text:"Arizona"});
  states['US'].push({value:'CA', text:"California"});
  states['US'].push({value:'CO', text:"Colorado"});
  states['US'].push({value:'CT', text:"Connecticut"});
  states['US'].push({value:'DC', text:"District of Columbia"});
  states['US'].push({value:'DE', text:"Delaware"});
  states['US'].push({value:'FL', text:"Florida"});
  states['US'].push({value:'FM', text:"Federated Micronesia"});
  states['US'].push({value:'GA', text:"Georgia"});
  states['US'].push({value:'GU', text:"Guam"});
  states['US'].push({value:'HI', text:"Hawaii"});
  states['US'].push({value:'IA', text:"Iowa"});
  states['US'].push({value:'ID', text:"Idaho"});
  states['US'].push({value:'IL', text:"Illinois"});
  states['US'].push({value:'IN', text:"Indiana"});
  states['US'].push({value:'KS', text:"Kansas"});
  states['US'].push({value:'KY', text:"Kentucky"});
  states['US'].push({value:'LA', text:"Louisiana"});
  states['US'].push({value:'MA', text:"Massachusetts"});
  states['US'].push({value:'MD', text:"Maryland"});
  states['US'].push({value:'ME', text:"Maine"});
  states['US'].push({value:'MH', text:"Marshall Islands"});
  states['US'].push({value:'MI', text:"Michigan"});
  states['US'].push({value:'MN', text:"Minnesota"});
  states['US'].push({value:'MO', text:"Missouri"});
  states['US'].push({value:'MP', text:"Northern Mariana Islands"});
  states['US'].push({value:'MS', text:"Mississippi"});
  states['US'].push({value:'MT', text:"Montana"});
  states['US'].push({value:'NC', text:"North Carolina"});
  states['US'].push({value:'ND', text:"North Dakota"});
  states['US'].push({value:'NE', text:"Nebraska"});
  states['US'].push({value:'NH', text:"New Hampshire"});
  states['US'].push({value:'NJ', text:"New Jersey"});
  states['US'].push({value:'NM', text:"New Mexico"});
  states['US'].push({value:'NV', text:"Nevada"});
  states['US'].push({value:'NY', text:"New York"});
  states['US'].push({value:'OH', text:"Ohio"});
  states['US'].push({value:'OK', text:"Oklahoma"});
  states['US'].push({value:'OR', text:"Oregon"});
  states['US'].push({value:'PA', text:"Pennsylvania"});
  states['US'].push({value:'PR', text:"Puerto Rico"});
  states['US'].push({value:'PW', text:"Palau"});
  states['US'].push({value:'RI', text:"Rhode Island"});
  states['US'].push({value:'SC', text:"South Carolina"});
  states['US'].push({value:'SD', text:"South Dakota"});
  states['US'].push({value:'TN', text:"Tennessee"});
  states['US'].push({value:'TX', text:"Texas"});
  states['US'].push({value:'UM', text:"United States Minor Outlying Islands"});
  states['US'].push({value:'UT', text:"Utah"});
  states['US'].push({value:'VA', text:"Virginia"});
  states['US'].push({value:'VI', text:"US Virgin Islands"});
  states['US'].push({value:'VT', text:"Vermont"});
  states['US'].push({value:'WA', text:"Washington"});
  states['US'].push({value:'WI', text:"Wisconsin"});
  states['US'].push({value:'WV', text:"West Virginia"});
  states['US'].push({value:'WY', text:"Wyoming"});
});