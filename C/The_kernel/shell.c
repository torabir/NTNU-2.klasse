#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>
#include <string.h>
#include <sys/wait.h>

int main()
{
    char input[256];
    while(1)
    {
        printf("shell> ");
        fflush(0);
    
        fgets(input, sizeof(input), stdin);
        if(strlen(input) < 2)
            continue;
        input[strlen(input)-1] = '\0'; // Strip newline

        int pid = fork();
        if(pid == 0)
        {
            // Child
            char *args[] = {input, NULL};
            char *env[] = {NULL};
            execve(input, args, env);
        }
        else
        {
            // Parent, wait
            waitpid(pid, NULL, 0);
        }
    }
}