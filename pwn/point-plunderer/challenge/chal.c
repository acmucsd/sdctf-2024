#include <stdio.h>
#include <stdlib.h>

int main() {
    setvbuf(stdin, NULL, _IONBF, 0);
    setvbuf(stdout, NULL, _IONBF, 0);

    unsigned int points = 1000; // Initial points
    unsigned int bankPoints = 1000;
    int choice;
    
    puts("Welcome to ByteBreach Point Management System!\n");
    printf("You currently have %d points.\n", points);
    puts("try to get 1 MILLION points and break the bank!");

    while(1) {
        puts("\nMenu:\n");
        puts("1. Add Points\n");
        puts("2. Subtract Points\n");
        puts("3. Exit\n");
        puts("Enter your choice: ");
        scanf("%d", &choice);
        
        switch(choice) {
            case 1:
                puts("Enter points to add: ");
                int addPoints;
                scanf("%d", &addPoints);
                if (bankPoints > addPoints && addPoints > 0){
                    points += addPoints;
                    bankPoints -= addPoints;
                    puts("Points added successfully.\n");
                }
                else{
                    puts("Bank doesn't have enough points or malformed input\n");
                }
                break;
            case 2:
                puts("Enter points to subtract: ");
                int subPoints;
                scanf("%d", &subPoints);
                points -= subPoints;
                bankPoints += subPoints;
                puts("Points subtracted successfully.\n");
                break;
            case 3:
                puts("Exiting...\n");
                return 0;
            default:
                puts("Invalid choice! Please try again.\n");
        }
        
        // Display current points
        printf("Current points: %ul\n", points);
        if(points > 1000000){
            system("/bin/sh");
        }
    }
    
    return 0;
}
