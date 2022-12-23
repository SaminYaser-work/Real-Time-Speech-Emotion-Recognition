import os

with open('logs.txt', 'w') as f:
    f.write('')

if os.name == 'posix':
    os.system('rm -rf ./runs/*')
else:
    os.system('del /q .\\runs\\*')
