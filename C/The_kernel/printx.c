#include<stdio.h>
#include<stdlib.h>

// - int main er hovedfuksjonen
// - int argc er argument counter. Dvs hvor mange argumenter funksjonen skal ta 
// inn (som blir sendt til programmet fra kommandolinjen (inkludert programnavnet).
// - char *argv[] er en array av strenger som inneholder disse argumentene.
//  Hvert element i argv peker til en streng. 
int main (int argc, char *argv[])
{
    // Standardverdi til X hvis ingen gyldig verdi er gitt:
    int X = 1; 
    // Sjekker om brukeren har gitt nok argumenter(2 stk: programnavn og X): 
    if(argc>=2){
        // Konverterer argumentvektoren/kommundoargumentet argv til heltall:
        X = atoi(argv[1]);  
        // Hvis atoi() returnerer 0 eller et negativt tall, sett X til 1:
        if(X<=0){
            X = 1; 
        }
    }
    // Les en streng fra standard input (stdin): 
    char input[100]; 
    printf("Enter a string: "); 
    // fgets: første argument er bufferet hvor strengen lagres, 
    // andre er maksimal antall tegn (inkludert nullterminator), 
    // tredje er standard input (tastaturet)
    fgets(input, sizeof(input), stdin);

    // Skriv ut strengen X antall ganger: 
    for(int i=0; i<X; i++){
        printf("%s", input); 
    }
    return 0; 
}

// Ymse feil: 

    // scanf("'%d'", inputConverted);
    // printf("'%d'", inputConverted);
    //char str[100] = "3 Egg"; 
    //int strConverted = atoi(str);

    //printf("Strengen '%s' er konvertert til heltall er '%d'\n", str, strConverted);

    // char input[100] = printf("Write a string: \n");
    // int inputConverted = atoi(input);
    //char str[100] = "3 Egg"; 
    //int strConverted = atoi(str);

    //printf("Strengen '%s' er konvertert til heltall er '%d'\n", str, strConverted);

// int main (void){
//     char input = printf("Hello world! \n");
//     char str[100] = "3 Egg"; 
//     int strConverted = atoi(str);

//     printf("Strengen '%s' er konvertert til heltall er '%d'\n", str, strConverted);
//     return 0; 
// }

// int main(void){
//     char X = printf("Enter a string: \n");
//     char input = scanf("%s", X);

//     for(i=0; i<2; i++){
//         printf("%s", X);
//     }
//     exit; 
// }

// The way: 

// #include <stdio.h>
// #include <stdlib.h>

// int main(int argc, char *argv[]) {
//     // Konverter kommandoargumentet til et heltall
//     int X = atoi(argv[1]);

//     // Les en streng fra standard input
//     char str[100];
//     printf("Enter a string: ");
//     fgets(str, sizeof(str), stdin);

//     // Skriv ut strengen X ganger
//     for (int i = 0; i < X; i++) {
//         printf("%s", str);
//     }

//     return 0;
// }