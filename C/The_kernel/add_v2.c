#include <stdio.h>

int main()
{
	int number1;
	int number2;
	int sum;

	printf("Enter two integers: ");
	scanf("%d %d", &number1, &number2);

	if(number1 > 100 || number2 > 100)
	{
		printf("At least one number is too large!\n");
		return 1;
	}

	sum = number1 + number2;

	printf("Sum of %d and %d is %d\n", number1, number2, sum);
	return 0;
}
