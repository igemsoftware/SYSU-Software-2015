%Function
function dy=example(t,y)

%t=[0,0.1,200];
%y=zeros(6,1);   %row vector

%Parameters change them as you want!
a=80;
k=50;
a1=20;
a2=20;
u1=20;
u2=20;
u3=20;
u4=20;
dna=150;

%Define components of ODEs
UVB=y(1); puvr8=y(2);pci=y(3);ptetr=y(4);YFP=y(5);GFP=y(6);
b=1/(1+(puvr8*ptetr));
c=1/(1+pci);

%Write ODEs 
dy=[t;(a*dna/(1+y(1).^k))-u1*y(2);b*dna-u2*y(3);
    c*dna-u3*y(4);b*dna/(1+GFP.^a1)-u4*YFP;c*dna/(1+YFP.^a1)-u4*GFP;];

%Transpose matrix
%dy=dy'; 

end

options=odeset('RelTol',1e-4,'AbsTol',[1e-4 1e-4 1e-4 1e-4 1e-4 1e-4 1e-4 1e-4]);
[t,y]=ode45(@example,[0,3],[0;0;0;0;0;0]);
plot(t,y(:,5),'-',t,y(:,6),'--')
title('Solution of example');
xlabel('time T')
ylabel('output of YFP/GFP');
legend('YFP','GFP')

