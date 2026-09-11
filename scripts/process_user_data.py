raw_prompt = """Name,Phone Number,Gender,Date of Joining/Conversion,DOB,Membership Status,Plan Type,Plan Expiry Date,Fees Due (Rs)
rajesh,+919743649447,male,03-06-2026,04-06-1988,Active,3 Month's,03-09-2026,0.0
pramod  as,+919902358097,male,03-03-2026,27-03-1990,Active,6 Month's,03-09-2026,0.0
santhosh kumar,+919886852148,male,03-06-2026,01-11-1993,Active,3 Month's,03-09-2026,0.0
PRASHANTH C,+919449144513,male,03-07-2026,01-05-1992,Active,3 Month's,03-10-2026,0.0
basavanna r,+918317368611,male,04-09-2025,14-03-1994,Active,1 Year membership,04-09-2026,3000.0
vedanth v,+917892143578,male,01-07-2026,29-01-2007,Active,3 Month's,04-11-2026,0.0
spoorthi r,+919606956546,female,04-12-2025,26-02-2006,Active,1 Year membership,04-12-2026,0.0
keerthi m,+918217208883,female,04-12-2025,12-10-2006,Active,1 Year membership,04-12-2026,0.0
yashvwanth s,+919611355116,male,05-01-2026,28-08-2009,Active,1 Year membership,05-01-2027,6999.0
sanjay h,+916366642096,male,05-06-2026,05-06-2008,Active,3 Month's,05-09-2026,0.0
SHARATH S N,+917090268676,male,05-08-2026,10-10-2000,Active,1 Month gym membership,05-09-2026,0.0
mansisharma m,+917411360734,female,05-11-2024,08-08-2005,Active,1 Year membership,05-11-2025,0.0
revanna s,+918123263394,male,25-12-2024,16-10-1993,Active,3 Month's,05-11-2026,0.0
sachin sm,+917795306748,male,05-02-2026,30-06-2000,Active,1 Year membership,06-08-2027,0.0
ganesh s,+918073709996,male,04-06-2026,24-01-1993,Active,1 Month gym membership,06-09-2026,0.0
PRAKASH A,+918105480442,male,06-07-2026,23-03-1991,Active,3 Month's,06-10-2026,0.0
yashvanth r,+916366238744,male,24-11-2025,24-08-2004,Active,3 Month's,06-10-2026,0.0
YASHVANTH R,+919632939214,male,06-07-2026,26-07-1999,Active,3 Month's,06-10-2026,0.0
VERESH S,+917483953688,male,06-07-2026,04-10-2005,Active,3 Month's,06-10-2026,2499.0
DHANUSH B M,+917483837552,male,06-07-2026,04-08-2004,Active,3 Month's,06-10-2026,0.0
prashanth  sr,+919591837244,male,05-10-2024,,Active,1 Year membership,06-10-2026,0.0
AVINASH N,+916362831525,male,06-07-2026,30-03-2000,Active,3 Month's,06-10-2026,0.0
Adi U P,+918550058345,male,06-08-2026,24-09-1995,Active,3 Month's,06-11-2026,0.0
Sumanth,+918197316580,male,06-08-2026,03-06-2002,Active,3 Month's,06-11-2026,0.0
Arun surya,+916360945335,male,06-08-2026,12-03-1994,Active,3 Month's,06-11-2026,0.0
akshay d s,+918197015304,male,06-08-2026,25-05-2001,Active,3 Month's,06-11-2026,0.0
madhu p,+919972398499,male,08-04-2026,17-01-2010,Active,1 Year membership,08-04-2027,1000.0
vikas m,+917899868018,male,08-02-2025,10-05-2005,Active,3 Month's,08-05-2025,0.0
pavan n,+918105542370,male,08-06-2026,03-04-2006,Active,3 Month's,08-09-2026,999.0
ajay m,+918123564610,male,08-06-2026,02-02-2005,Active,3 Month's,08-09-2026,0.0
inchara r,+919606956544,female,09-06-2026,19-05-2004,Active,1 Year membership,09-06-2027,0.0
Suhas N,+917795913994,male,13-05-2025,01-07-2009,Active,1 Year membership,10-12-2026,0.0
preetham m,+918431738472,male,13-05-2025,05-02-2010,Active,1 Year membership,10-12-2026,0.0
chandra shaker  gl,+919620988393,male,02-01-2025,01-06-1989,Active,1 Year membership,11-06-2027,0.0
sinchana n,+917204149548,female,15-10-2025,21-08-2005,Active,1 Year membership,11-07-2027,0.0
bivanth k,+919945370322,male,23-07-2025,09-06-2009,Active,1 Year membership,11-08-2027,0.0
n  balaji nayak,+919845612130,male,11-09-2024,26-01-1986,Active,1 Year membership,11-09-2025,0.0
bhargav,+918296710766,male,12-08-2026,05-06-2004,Active,3 Month's,12-11-2026,0.0
lohith a,+917899567261,male,13-07-2026,29-11-2001,Active,3 Month's,13-10-2026,0.0
simon david,+916362432922,male,15-06-2026,11-02-2004,Active,3 Month's,15-09-2026,0.0
srinivas m,+919743701056,male,09-02-2026,08-06-2001,Active,3 Month's,15-10-2026,0.0
rajesh s,+918722232477,male,20-02-2025,20-03-1972,Active,6 Month's,16-08-2026,2999.0
voshin,+917899410815,male,17-08-2026,22-10-2005,Active,1 Year membership,17-08-2027,4999.0
soorath,+916360246051,male,17-08-2026,01-02-2005,Active,1 Year membership,17-08-2027,6999.0
shashank,+917338251402,male,17-08-2026,29-01-2005,Active,1 Year membership,17-08-2027,6999.0
krishna,+919611539762,male,04-06-2026,18-01-1996,Active,1 Month gym membership,17-09-2026,0.0
rohith k,+919380068778,male,18-05-2026,17-02-2010,Active,1 Year membership,18-05-2027,3499.0
GIRESH S,+917353394358,male,18-06-2026,06-01-1993,Active,1 Year membership,18-06-2027,6999.0
sukrutha k,+917899951564,male,08-05-2026,29-10-2001,Active,3 Month's,18-09-2026,0.0
jnanesh r,+917204209810,male,19-09-2024,22-09-2008,Active,1 Year membership,19-09-2025,0.0
arunkumar s,+919448328301,male,20-12-2024,01-05-2001,Active,3 Month's,20-08-2026,0.0
mahendra m,+916362682329,male,21-05-2026,04-04-2004,Active,3 Month's,21-08-2026,2500.0
akshay p,+918147704660,male,21-07-2026,03-06-1997,Active,1 Month gym membership,21-08-2026,999.0
jai vaibhav,+918310818889,male,18-06-2026,25-01-2008,Active,3 Month's,21-10-2026,0.0
dashami s,+918548981529,female,21-07-2026,06-12-2008,Active,3 Month's,21-10-2026,0.0
raviprasad,+919008023501,male,22-07-2026,15-12-1987,Active,1 Month gym membership,22-08-2026,0.0
chandan m,+916361092149,male,22-09-2025,14-05-2007,Active,1 Year membership,22-09-2026,0.0
CHETHAN  G,+918147474375,male,22-06-2026,07-07-1996,Active,3 Month's,22-09-2026,0.0
KARTHIK V,+919535036614,male,22-06-2026,15-06-1997,Active,3 Month's,22-09-2026,0.0
guru raj p,+918792379863,male,23-06-2026,26-09-1997,Active,3 Month's,23-09-2026,0.0
prasahanth s,+919066990593,male,05-06-2025,10-02-1997,Active,3 Month's,24-09-2026,0.0
mohan kumar r,+919880154966,male,09-07-2025,21-03-2008,Active,3 Month's,24-11-2026,0.0
chethan m,+917795004358,male,25-05-2026,23-09-2005,Active,3 Month's,25-08-2026,0.0
darshan g,+917338154964,male,27-05-2026,12-08-1998,Active,3 Month's,27-08-2026,0.0
manoj m,+919686306219,male,27-05-2026,05-01-1999,Active,3 Month's,27-08-2026,0.0
arunkumar k k,+918861583650,male,03-10-2024,,Active,1 Year membership,27-09-2026,0.0
likhith r,+919036006604,male,28-01-2026,08-04-2008,Active,1 Year membership,28-01-2027,0.0
varadharaj gowda,+919353225478,male,30-12-2025,17-03-2009,Active,6 Month's,28-09-2026,2500.0
Jeevitha,+917975981458,female,29-07-2026,11-06-2008,Active,1 Month gym membership,29-08-2026,0.0
aditi,+919884677797,female,29-07-2026,11-08-1980,Active,DEMO,,0.0
"""

with open('scripts/raw_input.txt', 'w') as f:
    f.write(raw_prompt)
print("Saved raw input to scripts/raw_input.txt")
