with open('version_control.txt', 'r') as file:
    v = file.readline()
    cur_v = str(int(v.strip()) + 1)

with open('dist/index.html', 'r') as file:
    data = file.readlines()
    data = ''.join(data)
    data = data.replace(".js", ".js?v="+cur_v)

with open('dist/index.html', 'w') as file:
    file.write(data)

with open('version_control.txt', 'w') as file:
    file.write(cur_v)
