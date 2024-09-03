#include <signal.h>
#include <stdio.h>
#include <unistd.h>

void handler(int num)
{
    printf("We caught a signal %d\n", num);
}

int main()
{
    signal(SIGTERM, handler);
    signal(SIGUSR1, handler);
    signal(SIGSEGV, handler);

/*    char *pointer = NULL;
    *pointer = 10;
*/
    while (1)
    {
        printf("Sleeping for 5 seconds...\n");
        sleep(5);
    }
}
