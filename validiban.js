'use strict'
/**
 * Validar IBAN
 */
angular.module('ngValidateIban', [])
	.factory('$ibanEsValidators', function(){
		return {
            // Función que devuelve los números correspondientes a cada letra
            getNumIBAN: function(letra){
                var letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                return letras.search(letra) + 10;
            },
            
            modulo97: function(iban) {
                var parts = Math.ceil(iban.length/7);
                var remainer = "";

                for (var i = 1; i <= parts; i++) {
                    remainer = String(parseFloat(remainer+iban.substr((i-1)*7, 7))%97);
                }
                return remainer;
            },
            
            validaIBAN: function(IBAN){
                IBAN = IBAN.toUpperCase();
                IBAN = IBAN.trim(); // Quita espacios al principio y al final
                IBAN = IBAN.replace(/\s/g, ""); // Quita espacios del medio
                var num1,num2;
                var isbanaux;
                if (IBAN.length != 24){ // En España el IBAN son 24 caracteres
                    return false;
                }else{
                    num1 = this.getNumIBAN(IBAN.substring(0, 1));
                    num2 = this.getNumIBAN(IBAN.substring(1, 2));
                    isbanaux = IBAN.substr(4) + String(num1) + String(num2) + IBAN.substr(2,2);
                    var resto = this.modulo97(isbanaux);
                    if (resto == 1){
                        return true;
                    }else{
                        return false;
                    }
                }
                
            },
		};
	})
	.directive('validateIban',['$ibanEsValidators', function($ibanEsValidators, $timeout){
		return {
			restric: 'A',
			require: 'ngModel',
			link: function(scope, elem, iAttrs, ctrl) {

				ctrl.$parsers.unshift(checkIban);

				function checkIban (value) {
					var empty = ctrl.$isEmpty(value);
					if (empty) {

						ctrl.$setValidity('validateIban',false);

					}else{

						if ($ibanEsValidators.validaIBAN(value)) {
							console.log("IBAN OK");
            				ctrl.$setValidity('validateIban',true);

            			}else{

            				ctrl.$setValidity('validateIban',false);

            			}	
					}
				return value;
				};

			}
		}
	}]);
