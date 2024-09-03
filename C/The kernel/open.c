#include <stdio.h>

int main()
{
    FILE *f = fopen("test.txt", "r");
    if (f == NULL)
    {
        printf("could not find file\n");
        return 1;
    }
    return 0;
}
