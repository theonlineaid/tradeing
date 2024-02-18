# Benemoy Securities Ltd.

## Project Summery

### Commit conventions:

`feat(dir)[sub-folder/file]: a short commit message`

- **feat** - To add new features
- **refactor** - Update code
- **chore** - chore coding or features
- **style** - style add or update (ex. css)
- **fix** - fix bug or problems

### Issue create

We manage every new features or problems using `Jira Issues` in `BitBucket`.

## v1.2

### Date: November 8, 2022

Branch: v1.2

### Features:

1. Registration Page:

- OTP sending method not showing
  - If it send by email then it show the email first some currectors
  - If it is sent by mobile then it shows the mobile number last two digits.
- Signout not working in this page
- Profile name or username showing this page is UX recommendation

2. Dashboard Page:

- Add loading progress for Trading Map -> done
- When trading socket off or send error it’s show the alert in dashboard -> done
- Add toggle button to on off watch mode -> done
- Add layout menu to select layouts as like notification menu -> done
- Trading list table height according to container - (this value will be changeable, use useRef to create dynamic) -> done

### Bug Fix:

1. Order List -> remove all from options on side
2. BO Account

- BO Account update -> data not updated -> fixed
- After reload bo account active steps are disable -> done
- Preview page
  - Bo Type - db not show - done
  - DP & BO Type of Bo Account not update ->done
  - Bank details -> Upload not working
  - Refactor Bo Account code
  - Change datepicker -> done

Solve the issue then create a pull request with the issue reference.
