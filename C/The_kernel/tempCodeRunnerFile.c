#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>
#include <string.h>
#include <sys/wait.h>

int main()
{
    // Loop to read user input
    while(1){
        //Promt the user input
        printf("shell>");
        // Buffer for the user input
        char input [256]; 
        // Read user input
        fgets(input, 256, stdin);
        // Calculate the number of characters entered in the input 
        int numchars = strlen(input);

        // Validate user input. 
        // If input is just a newline, jump to next iteration in the loop

        if(numchars == 1)
            continue;
        if(numchars == 0)
            return 0; 
        // Remove the newline character and replace newline with 
        // the null terminator (necessary for execve())
        input[numchars-1] = '\0';

        // Fork the process fork(), meaning: copy the running prosess to memory as a child process
        int pid = fork();
        // Sjekker om vi er i child-process
        if(pid == 0)
        {
            // Hele execve()-blokken: Kjør brukerens kommando i child-prosessen 
            // ved å erstatte denne prosessen med execve() 
            // - Opprett en argumentliste hvor første element er inputkommando 
            // og siste element er NULL

            char *args[] = {input, NULL};
            // execve(): 
            // erstatter den kjørende child-prosessen med et nytt program. 
            // -input er stien til programmet (brukerinput) 
            // -args er argumentene for programmet ()
            // -NULL brukes for miljøvariablene.
            execve(input, args, NULL);

            // If execve() fails, print an error and exit child
            perror("execve failed");
            return 1;
        }
    else if (pid > 0){
        // Parent process: wait for the child to finish using waitpid()
        waitpid(pid, NULL, 0);
    } else {
        // Fork failed
        perror("fork failed");
        return 1;
    }
        return 0;
        // Print the userinput:
        // printf("%s\n", input);
    }
}