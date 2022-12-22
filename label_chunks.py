from tkinter import *
import pickle
import os

# Create an instance of Tkinter frame or window
win = Tk()
# Set the geometry of tkinter frame
win.geometry("1200x500")

# classes = [
#     "Angry 😠",
#     "Disgust 🤮",
#     "Fear 😨",
#     "Happy 😃",
#     "Neutral 😐",
#     "Sad 😭",
#     "Surprised 😲",
# ]
classes = [
    "Angry / Disgust",
    "Fear / Surprise",
    "Happy",
    "Neutral",
    "Sad",
]

ds = {
    'path': [],
    'vggish': [],
    'hubert': [],
    'given_tag': []
}

for dir, _, files in os.walk('./runs/'):
    for file in files:
        path = os.path.join(dir, file)
        _, vggish, hubert = file.split('_')
        ds['path'].append(path)
        ds['vggish'].append(vggish)
        ds['hubert'].append(hubert.removesuffix('.wav'))
        ds['given_tag'].append(-1)


def get_info():
    info = ''
    for i in range(len(ds['path'])):
        info += f'{i} {ds["vggish"][i]} {ds["hubert"][i]} {ds["given_tag"][i]}\n'
    return info


stride = 1
curr_idx = 0
total = len(ds['path'])

btnX = 20
btnY = 10
tags = []


frame = Frame(win)
frame.grid(row=0, column=0, sticky='nsew')

idx_label = Label(win, text=f'{curr_idx}/{total}', font=('Century 20 bold'))
idx_label.grid(row=0, column=0)


def play_audio(path):
    os.system(f'ffplay -nodisp -autoexit {path}')


def callback():
    global curr_idx
    for i in range(stride):
        play_audio(ds['path'][i + curr_idx])


def inc_idx():
    global curr_idx
    global total
    if curr_idx < total - stride:
        curr_idx += stride
        idx_label.config(text=f'{curr_idx}/{total}')
    update_stride(1)


def save_dic():
    with open('data.pkl', 'wb') as f:
        pickle.dump(ds, f)


# Button for playing audio
btnPlay = Button(win, text="Play", command=callback)
btnPlay.grid(row=1, column=0, padx=(10), pady=10, ipadx=btnX, ipady=btnY)
# win.bind('<Return>', lambda event: callback())

# Button for going to next audio
btnNext = Button(win, text="Next", command=inc_idx)
btnNext.grid(row=1, column=1, padx=(10), pady=10, ipadx=btnX, ipady=btnY)

# Drop down menu for selecting emotion
clicked = StringVar()
clicked.set(classes[0])
drop = OptionMenu(win, clicked, *classes)
drop.grid(row=1, column=2, padx=(10), pady=10, ipadx=btnX, ipady=btnY)


# Button for setting emotion
def set_tag():
    value = classes.index(clicked.get())
    for i in range(stride):
        ds['given_tag'][i + curr_idx] = value
    text.delete(1.0, END)
    text.insert(END, get_info())
    inc_idx()
    callback()


btnSet = Button(win, text="Set", command=set_tag)
btnSet.grid(row=1, column=3, padx=(10), pady=10, ipadx=btnX, ipady=btnY)

# Slider for the stride

stride_label = Label(win, text=f"Stride: {stride}", font=('Century 20 bold'))
stride_label.grid(row=0, column=1)


def update_stride(val):
    global stride
    stride = int(val)
    stride_label.config(text=f"Stride: {stride}")


slider_value = IntVar()
slider = Scale(win, from_=1, to=4, orient=HORIZONTAL,
               variable=slider_value, command=update_stride)
slider.grid(row=2, column=0, padx=(10), pady=10, ipadx=btnX, ipady=btnY)


# Button for saving emotion
btnSave = Button(win, text="Save", command=save_dic)
btnSave.grid(row=3, column=0, padx=(10), pady=10, ipadx=btnX, ipady=btnY)

# Text box
text = Text(win, height=10, width=100)
text.grid(row=4, column=0)
text.delete(1.0, END)
text.insert(END, get_info())

win.mainloop()
